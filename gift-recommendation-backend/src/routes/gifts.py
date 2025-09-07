from flask import Blueprint, request, jsonify
from src.models.gift import db, Gift, Category, QuestionnaireResponse, Recommendation
import json
import uuid
from datetime import datetime

gifts_bp = Blueprint('gifts', __name__)

@gifts_bp.route('/gifts', methods=['GET'])
def get_gifts():
    """Get all gifts with optional filtering"""
    try:
        # Get query parameters
        category = request.args.get('category')
        min_price = request.args.get('min_price', type=float)
        max_price = request.args.get('max_price', type=float)
        search = request.args.get('search')
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 20, type=int)
        
        # Build query
        query = Gift.query.filter_by(is_active=True)
        
        if category:
            query = query.filter_by(category=category)
        
        if min_price:
            query = query.filter(Gift.price >= min_price)
            
        if max_price:
            query = query.filter(Gift.price <= max_price)
            
        if search:
            query = query.filter(
                db.or_(
                    Gift.name_ar.contains(search),
                    Gift.name_en.contains(search),
                    Gift.description_ar.contains(search),
                    Gift.description_en.contains(search)
                )
            )
        
        # Paginate results
        gifts = query.paginate(
            page=page, 
            per_page=per_page, 
            error_out=False
        )
        
        return jsonify({
            'success': True,
            'gifts': [gift.to_dict() for gift in gifts.items],
            'pagination': {
                'page': page,
                'per_page': per_page,
                'total': gifts.total,
                'pages': gifts.pages,
                'has_next': gifts.has_next,
                'has_prev': gifts.has_prev
            }
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@gifts_bp.route('/gifts/<int:gift_id>', methods=['GET'])
def get_gift(gift_id):
    """Get a specific gift by ID"""
    try:
        gift = Gift.query.get_or_404(gift_id)
        return jsonify({
            'success': True,
            'gift': gift.to_dict()
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@gifts_bp.route('/categories', methods=['GET'])
def get_categories():
    """Get all categories"""
    try:
        categories = Category.query.filter_by(is_active=True).all()
        return jsonify({
            'success': True,
            'categories': [category.to_dict() for category in categories]
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@gifts_bp.route('/questionnaire', methods=['POST'])
def submit_questionnaire():
    """Submit questionnaire responses and get recommendations"""
    try:
        data = request.get_json()
        
        # Generate session ID
        session_id = str(uuid.uuid4())
        
        # Save questionnaire response
        response = QuestionnaireResponse(
            session_id=session_id,
            organization_type=data.get('1'),  # Question 1
            occasion=data.get('2'),  # Question 2
            quantity_range=data.get('3'),  # Question 3
            budget_per_item=data.get('4', [100])[0] if data.get('4') else 100,  # Question 4
            preferred_type=data.get('5'),  # Question 5
            preferred_colors=data.get('6'),  # Question 6
            customization_preference=data.get('7')  # Question 7
        )
        
        db.session.add(response)
        db.session.commit()
        
        # Get AI recommendations
        recommendations = get_ai_recommendations(data, session_id)
        
        return jsonify({
            'success': True,
            'session_id': session_id,
            'recommendations': recommendations
        })
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)}), 500

def get_ai_recommendations(questionnaire_data, session_id):
    """AI-powered gift recommendation system"""
    try:
        # Get all active gifts
        all_gifts = Gift.query.filter_by(is_active=True).all()
        
        # Scoring algorithm
        scored_gifts = []
        
        for gift in all_gifts:
            score = calculate_gift_score(gift, questionnaire_data)
            if score > 0:
                scored_gifts.append({
                    'gift': gift,
                    'score': score,
                    'reasoning': generate_reasoning(gift, questionnaire_data, score)
                })
        
        # Sort by score (highest first)
        scored_gifts.sort(key=lambda x: x['score'], reverse=True)
        
        # Take top 20 recommendations
        top_recommendations = scored_gifts[:20]
        
        # Save recommendations to database
        for rec in top_recommendations:
            recommendation = Recommendation(
                session_id=session_id,
                gift_id=rec['gift'].id,
                score=rec['score'],
                reasoning=rec['reasoning']
            )
            db.session.add(recommendation)
        
        db.session.commit()
        
        # Return formatted recommendations
        return [
            {
                'gift': rec['gift'].to_dict(),
                'score': rec['score'],
                'reasoning': rec['reasoning']
            }
            for rec in top_recommendations
        ]
        
    except Exception as e:
        db.session.rollback()
        raise e

def calculate_gift_score(gift, questionnaire_data):
    """Calculate compatibility score for a gift based on questionnaire responses"""
    score = 0.0
    
    # Budget compatibility (40% weight)
    budget = questionnaire_data.get('4', [100])[0] if questionnaire_data.get('4') else 100
    if gift.price <= budget:
        if gift.price <= budget * 0.8:
            score += 40  # Perfect budget fit
        else:
            score += 30  # Good budget fit
    elif gift.price <= budget * 1.2:
        score += 20  # Slightly over budget
    else:
        score += 0   # Too expensive
    
    # Organization type compatibility (25% weight)
    org_type = questionnaire_data.get('1')
    if org_type and gift.target_organizations:
        target_orgs = json.loads(gift.target_organizations) if isinstance(gift.target_organizations, str) else gift.target_organizations
        if org_type in target_orgs:
            score += 25
        elif 'all' in target_orgs:
            score += 20
    else:
        score += 15  # Default score if no specific targeting
    
    # Occasion compatibility (20% weight)
    occasion = questionnaire_data.get('2')
    if occasion and gift.occasions:
        occasions = json.loads(gift.occasions) if isinstance(gift.occasions, str) else gift.occasions
        if occasion in occasions:
            score += 20
        elif 'all' in occasions:
            score += 15
    else:
        score += 10  # Default score
    
    # Gift type preference (10% weight)
    preferred_type = questionnaire_data.get('5')
    if preferred_type and gift.category:
        if preferred_type == gift.category:
            score += 10
        elif preferred_type == 'mixed':
            score += 8
    else:
        score += 5  # Default score
    
    # Color preference (3% weight)
    preferred_colors = questionnaire_data.get('6')
    if preferred_colors and gift.colors:
        colors = json.loads(gift.colors) if isinstance(gift.colors, str) else gift.colors
        if preferred_colors in ['saudi_colors'] and any(color in ['green', 'gold'] for color in colors):
            score += 3
        elif preferred_colors in ['neutral'] and any(color in ['white', 'gray', 'beige'] for color in colors):
            score += 3
        elif preferred_colors in ['company_colors']:
            score += 2  # Customizable
    else:
        score += 1  # Default score
    
    # Customization preference (2% weight)
    customization = questionnaire_data.get('7')
    if customization and gift.is_customizable:
        if customization in ['yes_logo', 'yes_text', 'both']:
            score += 2
    elif customization == 'no':
        score += 1
    
    return min(score, 100)  # Cap at 100

def generate_reasoning(gift, questionnaire_data, score):
    """Generate human-readable reasoning for the recommendation"""
    reasons = []
    
    budget = questionnaire_data.get('4', [100])[0] if questionnaire_data.get('4') else 100
    if gift.price <= budget * 0.8:
        reasons.append("يناسب الميزانية المحددة بشكل ممتاز")
    elif gift.price <= budget:
        reasons.append("يناسب الميزانية المحددة")
    
    org_type = questionnaire_data.get('1')
    if org_type == 'government':
        reasons.append("مناسب للجهات الحكومية")
    elif org_type == 'private_company':
        reasons.append("مناسب للشركات الخاصة")
    
    occasion = questionnaire_data.get('2')
    if occasion == 'national_day':
        reasons.append("مثالي لمناسبة اليوم الوطني السعودي")
    elif occasion == 'eid':
        reasons.append("مناسب لمناسبات الأعياد")
    
    if gift.rating >= 4.5:
        reasons.append("تقييم عالي من العملاء")
    
    if gift.is_customizable:
        reasons.append("قابل للتخصيص والنقش")
    
    return " • ".join(reasons) if reasons else "هدية عالية الجودة ومناسبة لاحتياجاتكم"

@gifts_bp.route('/recommendations/<session_id>', methods=['GET'])
def get_recommendations(session_id):
    """Get saved recommendations for a session"""
    try:
        recommendations = Recommendation.query.filter_by(session_id=session_id).order_by(Recommendation.score.desc()).all()
        
        return jsonify({
            'success': True,
            'recommendations': [rec.to_dict() for rec in recommendations]
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

