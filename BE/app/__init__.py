from flask import Flask
from app.database import init_db
from dotenv import load_dotenv
import os

load_dotenv()

def create_app():
    app = Flask(__name__)
    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev-secret-key')
    
    # Initialize database
    init_db()
    
    # Set secret key for sessions
    app.secret_key = os.getenv('SECRET_KEY', 'your-secret-key-here')  # Make sure to set this in .env
    
    # Register blueprints
    from app.routes import bp
    app.register_blueprint(bp, url_prefix='/api')
    
    return app