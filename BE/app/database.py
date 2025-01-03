import pymysql
from pymysql.cursors import DictCursor
import os
from dotenv import load_dotenv

load_dotenv()

def get_db_connection():
    return pymysql.connect(
        host=os.getenv('DB_HOST', 'localhost'),
        user=os.getenv('DB_USER', 'root'),
        password=os.getenv('DB_PASSWORD', ''),
        database=os.getenv('DB_NAME', 'expense_tracker'),
        cursorclass=DictCursor
    )

def init_db():
    conn = get_db_connection()
    try:
        with conn.cursor() as cursor:
            # Create expenses table with FULLTEXT indexes
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS expenses (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    amount DECIMAL(10, 2) NOT NULL,
                    date DATE NOT NULL,
                    description VARCHAR(200),
                    category VARCHAR(50) NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FULLTEXT KEY ft_description (description),
                    FULLTEXT KEY ft_category (category),
                    FULLTEXT KEY ft_combined (description, category)
                ) ENGINE=InnoDB
            """)
        conn.commit()
    finally:
        conn.close() 