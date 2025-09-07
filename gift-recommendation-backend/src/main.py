import os
import sys
# DON'T CHANGE THIS !!!
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from flask import Flask, send_from_directory
from flask_cors import CORS
from src.models.user import db
from src.models.gift import Gift, Category, QuestionnaireResponse, Recommendation
from src.routes.user import user_bp
from src.routes.gifts import gifts_bp

def add_sample_data():
    """Add sample gifts and categories to the database"""
    import json
    
    # Add categories
    categories = [
        Category(name_ar="أدوات مكتبية", name_en="Office Supplies", icon="briefcase"),
        Category(name_ar="إلكترونيات", name_en="Electronics", icon="smartphone"),
        Category(name_ar="منسوجات", name_en="Textiles", icon="shirt"),
        Category(name_ar="أدوات منزلية", name_en="Home Items", icon="home"),
        Category(name_ar="هدايا تذكارية", name_en="Souvenirs", icon="gift"),
        Category(name_ar="أكسسوارات", name_en="Accessories", icon="watch")
    ]
    
    for category in categories:
        db.session.add(category)
    
    # Add sample gifts
    gifts = [
        Gift(
            name_ar="قلم فاخر مع نقش الشعار",
            name_en="Luxury Pen with Logo Engraving",
            description_ar="قلم فاخر عالي الجودة مع إمكانية نقش شعار الشركة أو الجهة",
            description_en="High-quality luxury pen with company logo engraving option",
            price=45.0,
            original_price=60.0,
            category="office_supplies",
            image_url="/images/luxury-pen.jpg",
            colors=json.dumps(["gold", "silver", "black"]),
            occasions=json.dumps(["national_day", "conferences", "employee_appreciation"]),
            features=json.dumps(["premium_quality", "customizable", "gift_box"]),
            target_organizations=json.dumps(["government", "private_company", "all"]),
            min_quantity=50,
            max_quantity=1000,
            is_customizable=True,
            customization_options=json.dumps(["logo_engraving", "text_engraving"]),
            rating=4.8
        ),
        Gift(
            name_ar="كوب قهوة حراري بالشعار",
            name_en="Thermal Coffee Mug with Logo",
            description_ar="كوب قهوة حراري عالي الجودة يحافظ على درجة حرارة المشروبات مع إمكانية طباعة الشعار",
            description_en="High-quality thermal coffee mug that maintains beverage temperature with logo printing option",
            price=35.0,
            category="home_items",
            image_url="/images/thermal-mug.jpg",
            colors=json.dumps(["white", "black", "green", "gold"]),
            occasions=json.dumps(["national_day", "employee_appreciation", "client_gifts"]),
            features=json.dumps(["thermal_insulation", "customizable", "dishwasher_safe"]),
            target_organizations=json.dumps(["government", "private_company", "educational"]),
            min_quantity=100,
            max_quantity=2000,
            is_customizable=True,
            customization_options=json.dumps(["logo_printing", "color_customization"]),
            rating=4.6
        ),
        Gift(
            name_ar="باور بانك مع شعار الجهة",
            name_en="Power Bank with Organization Logo",
            description_ar="شاحن محمول عالي السعة مع إمكانية طباعة شعار الجهة أو الشركة",
            description_en="High-capacity portable charger with organization logo printing option",
            price=85.0,
            category="electronics",
            image_url="/images/power-bank.jpg",
            colors=json.dumps(["black", "white", "gold"]),
            occasions=json.dumps(["conferences", "employee_appreciation", "client_gifts"]),
            features=json.dumps(["fast_charging", "high_capacity", "customizable"]),
            target_organizations=json.dumps(["government", "private_company", "tech_companies"]),
            min_quantity=50,
            max_quantity=500,
            is_customizable=True,
            customization_options=json.dumps(["logo_printing", "laser_engraving"]),
            rating=4.7
        ),
        Gift(
            name_ar="مفكرة جلدية فاخرة",
            name_en="Luxury Leather Notebook",
            description_ar="مفكرة جلدية فاخرة مع إمكانية نقش الشعار والاسم",
            description_en="Luxury leather notebook with logo and name engraving option",
            price=65.0,
            category="office_supplies",
            image_url="/images/leather-notebook.jpg",
            colors=json.dumps(["brown", "black", "green"]),
            occasions=json.dumps(["national_day", "conferences", "executive_gifts"]),
            features=json.dumps(["genuine_leather", "premium_paper", "customizable"]),
            target_organizations=json.dumps(["government", "private_company", "financial"]),
            min_quantity=25,
            max_quantity=500,
            is_customizable=True,
            customization_options=json.dumps(["logo_embossing", "name_engraving"]),
            rating=4.9
        ),
        Gift(
            name_ar="ساعة حائط بالشعار",
            name_en="Wall Clock with Logo",
            description_ar="ساعة حائط أنيقة مع إمكانية طباعة شعار الجهة",
            description_en="Elegant wall clock with organization logo printing option",
            price=120.0,
            category="home_items",
            image_url="/images/wall-clock.jpg",
            colors=json.dumps(["white", "black", "gold"]),
            occasions=json.dumps(["national_day", "office_decoration", "client_gifts"]),
            features=json.dumps(["silent_movement", "customizable", "premium_design"]),
            target_organizations=json.dumps(["government", "private_company", "all"]),
            min_quantity=10,
            max_quantity=200,
            is_customizable=True,
            customization_options=json.dumps(["logo_printing", "custom_colors"]),
            rating=4.5
        )
    ]
    
    for gift in gifts:
        db.session.add(gift)
    
    db.session.commit()

app = Flask(__name__, static_folder=os.path.join(os.path.dirname(__file__), 'static'))
app.config['SECRET_KEY'] = 'asdf#FGSgvasgf$5$WGT'

# Enable CORS for all routes
CORS(app)

app.register_blueprint(user_bp, url_prefix='/api')
app.register_blueprint(gifts_bp, url_prefix='/api')

# uncomment if you need to use database
app.config['SQLALCHEMY_DATABASE_URI'] = f"sqlite:///{os.path.join(os.path.dirname(__file__), 'database', 'app.db')}"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)
with app.app_context():
    db.create_all()
    
    # Add sample data if database is empty
    if Gift.query.count() == 0:
        add_sample_data()

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    static_folder_path = app.static_folder
    if static_folder_path is None:
            return "Static folder not configured", 404

    if path != "" and os.path.exists(os.path.join(static_folder_path, path)):
        return send_from_directory(static_folder_path, path)
    else:
        index_path = os.path.join(static_folder_path, 'index.html')
        if os.path.exists(index_path):
            return send_from_directory(static_folder_path, 'index.html')
        else:
            return "index.html not found", 404


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
