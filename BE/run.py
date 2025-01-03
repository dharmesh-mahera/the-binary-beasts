import os
from app import create_app
from flask_cors import CORS

app = create_app()

# Enable CORS for all routes and origins
CORS(app, resources={r"/*": {"origins": "*"}})

if __name__ == '__main__':
    app.run(debug=True, port=os.getenv('SERVER_PORT', 5000))