import pymysql
import pymysql.cursors
from flask import current_app


class DatabaseManager:
    def __init__(self):
        self.connection = None

    def __enter__(self):
        self.connection = pymysql.connect(
            host=current_app.config['MYSQL_HOST'],
            user=current_app.config['MYSQL_USER'],
            password=current_app.config['MYSQL_PASSWORD'],
            database=current_app.config['MYSQL_DATABASE'],
            cursorclass=pymysql.cursors.DictCursor,
            charset="utf8mb4"
        )

        return self.connection

    def __exit__(self, exc_type, exc_val, exc_tb):
        if self.connection and self.connection.open:
            self.connection.close()
