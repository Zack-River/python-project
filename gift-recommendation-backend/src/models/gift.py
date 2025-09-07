from src.models.user import db
from datetime import datetime
import json

class Gift(db.Model):
    __tablename__ = 'gifts'
    
    id = db.Column(db.Integer, primary_key=True)
    name_ar = db.Column(db.String(200), nullable=False)
    name_en = db.Column(db.String(200), nullable=False)
    description_ar = db.Column(db.Text, nullable=False)
    description_en = db.Column(db.Text, nullable=False)
    price = db.Column(db.Float, nullable=False)
    original_price = db.Column(db.Float, nullable=True)
    category = db.Column(db.String(50), nullable=False)
    subcategory = db.Column(db.String(50), nullable=True)
    image_url = db.Column(db.String(500), nullable=True)
    colors = db.Column(db.Text, nullable=True)  # JSON string
    occasions = db.Column(db.Text, nullable=True)  # JSON string
    features = db.Column(db.Text, nullable=True)  # JSON string
    target_organizations = db.Column(db.Text, nullable=True)  # JSON string
    min_quantity = db.Column(db.Integer, default=1)
    max_quantity = db.Column(db.Integer, nullable=True)
    is_customizable = db.Column(db.Boolean, default=False)
    customization_options = db.Column(db.Text, nullable=True)  # JSON string
    rating = db.Column(db.Float, default=0.0)
    reviews_count = db.Column(db.Integer, default=0)
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'name_ar': self.name_ar,
            'name_en': self.name_en,
            'description_ar': self.description_ar,
            'description_en': self.description_en,
            'price': self.price,
            'original_price': self.original_price,
            'category': self.category,
            'subcategory': self.subcategory,
            'image_url': self.image_url,
            'colors': json.loads(self.colors) if self.colors else [],
            'occasions': json.loads(self.occasions) if self.occasions else [],
            'features': json.loads(self.features) if self.features else [],
            'target_organizations': json.loads(self.target_organizations) if self.target_organizations else [],
            'min_quantity': self.min_quantity,
            'max_quantity': self.max_quantity,
            'is_customizable': self.is_customizable,
            'customization_options': json.loads(self.customization_options) if self.customization_options else [],
            'rating': self.rating,
            'reviews_count': self.reviews_count,
            'is_active': self.is_active,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

class Category(db.Model):
    __tablename__ = 'categories'
    
    id = db.Column(db.Integer, primary_key=True)
    name_ar = db.Column(db.String(100), nullable=False)
    name_en = db.Column(db.String(100), nullable=False)
    description_ar = db.Column(db.Text, nullable=True)
    description_en = db.Column(db.Text, nullable=True)
    icon = db.Column(db.String(100), nullable=True)
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'name_ar': self.name_ar,
            'name_en': self.name_en,
            'description_ar': self.description_ar,
            'description_en': self.description_en,
            'icon': self.icon,
            'is_active': self.is_active,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class QuestionnaireResponse(db.Model):
    __tablename__ = 'questionnaire_responses'
    
    id = db.Column(db.Integer, primary_key=True)
    session_id = db.Column(db.String(100), nullable=False)
    organization_type = db.Column(db.String(50), nullable=True)
    occasion = db.Column(db.String(50), nullable=True)
    quantity_range = db.Column(db.String(20), nullable=True)
    budget_per_item = db.Column(db.Float, nullable=True)
    preferred_type = db.Column(db.String(50), nullable=True)
    preferred_colors = db.Column(db.String(50), nullable=True)
    customization_preference = db.Column(db.String(50), nullable=True)
    additional_notes = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'session_id': self.session_id,
            'organization_type': self.organization_type,
            'occasion': self.occasion,
            'quantity_range': self.quantity_range,
            'budget_per_item': self.budget_per_item,
            'preferred_type': self.preferred_type,
            'preferred_colors': self.preferred_colors,
            'customization_preference': self.customization_preference,
            'additional_notes': self.additional_notes,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class Recommendation(db.Model):
    __tablename__ = 'recommendations'
    
    id = db.Column(db.Integer, primary_key=True)
    session_id = db.Column(db.String(100), nullable=False)
    gift_id = db.Column(db.Integer, db.ForeignKey('gifts.id'), nullable=False)
    score = db.Column(db.Float, nullable=False)
    reasoning = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    gift = db.relationship('Gift', backref='recommendations')
    
    def to_dict(self):
        return {
            'id': self.id,
            'session_id': self.session_id,
            'gift_id': self.gift_id,
            'gift': self.gift.to_dict() if self.gift else None,
            'score': self.score,
            'reasoning': self.reasoning,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

