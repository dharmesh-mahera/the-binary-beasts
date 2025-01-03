# The Binary Beasts - Backend Project

## Project Overview
This is the backend repository for the Binary Beasts application, built using Flask and designed to provide robust API services.

## Prerequisites
- Python 3.9+
- pip (Python package manager)
- MySQL Database

## Project Setup

### 1. Clone the Repository
```bash
git clone https://github.com/your-org/the-binary-beasts.git
cd the-binary-beasts/BE
```

### 2. Create a Virtual Environment
```bash
# On Windows
python -m venv venv
venv\Scripts\activate

# On macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. Database Configuration
1. Create a MySQL database for the project
2. Copy `.env.example` to `.env`
3. Update the database connection details in the `.env` file

### 5. Database Migrations
```bash
# Run database migrations (if applicable)
flask db upgrade
```

### 6. Run the Application
```bash
python run.py
```

## Environment Variables
Create a `.env` file with the following variables:
- `DATABASE_URL`: MySQL database connection string
- `SECRET_KEY`: Flask secret key
- `DEBUG`: Development mode flag

## Testing
```bash
# Run tests
python -m pytest
```

## Project Structure
- `app/`: Main application package
  - `routes/`: API endpoint definitions
  - `models/`: Database models
  - `services/`: Business logic
- `config.py`: Configuration settings
- `run.py`: Application entry point

## Contributing
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## Technologies
- Flask 3.0.0
- PyMySQL 1.1.0
- Pydantic 2.5.2
- Python-dotenv 1.0.0

## License
[BinaryBeasts - All Rights Reserved]
