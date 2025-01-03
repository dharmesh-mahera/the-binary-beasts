import json

import bcrypt
from flask_jwt_extended import create_access_token, get_jwt

from app.common.exceptions import UserAlreadyExists, UserNotExists, InvalidPassword, UnauthorisedException
from app.model.database_manager import DatabaseManager
from app.model.sql_statements import sql_stmt


class UserRegistration:
    def __init__(self, request_body):
        self.data = request_body
        self.created_user_id = None

    def do_process(self):
        self.add_user()
        return self.parse_response()

    def add_user(self):
        with DatabaseManager() as connection:
            self.validate_user(connection)
            self.create_user(connection)
            self.create_password(connection)
            connection.commit()

    def validate_user(self, connection):
        with connection.cursor() as cur:
            cur.execute(sql_stmt['get_user_by_email'], {"email": self.data['email']})
            data = cur.fetchone()
        if data:
            raise UserAlreadyExists

    def create_user(self, connection):
        user = {
            "email": self.data['email'],
            "first_name": self.data['first_name'],
            "last_name": self.data['last_name'],

        }
        with connection.cursor() as cur:
            cur.execute(sql_stmt['create_user'], user)
            self.created_user_id = cur.lastrowid

    def create_password(self, connection):
        hash_password = bcrypt.hashpw(password=self.data['password'].encode('utf-8'), salt=bcrypt.gensalt())
        user_password_data = {
            "user_id": self.created_user_id,
            "password": hash_password
        }

        with connection.cursor() as cur:
            cur.execute(sql_stmt['create_user_password'], user_password_data)

    def parse_response(self):
        return json.dumps({
            "user_id": self.created_user_id
        })


class UserLoginService:
    def __init__(self, data):
        self.data = data
        self.user = {}

    def is_user_exists(self):
        with DatabaseManager() as connection:
            with connection.cursor() as cur:
                cur.execute(sql_stmt['get_user_by_email'], {"email": self.data['email']})
                self.user = cur.fetchone()
        if not self.user:
            raise UserNotExists

    def is_valid_password(self):
        with DatabaseManager() as connection:
            with connection.cursor() as cur:
                cur.execute(sql_stmt['get_user_password'], {"user_id": self.user['id']})
                data = cur.fetchone()

        if not data:
            # User deleted in middle of request
            raise UserNotExists

        if not bcrypt.checkpw(password=self.data['password'].encode('utf-8'),
                              hashed_password=data['password'].encode('utf-8')):
            raise InvalidPassword

    def do_process(self):
        self.is_user_exists()
        self.is_valid_password()
        return self.parse_response()

    def parse_response(self):
        return json.dumps({
            "access_token": create_access_token(
                identity=self.data['email'],
                additional_claims={"user_id": self.user['id']}
            )
        })


class UserListingService:

    @staticmethod
    def do_process():
        with DatabaseManager() as connection:
            with connection.cursor() as cur:
                cur.execute(sql_stmt['get_users'])
                users = cur.fetchall()

        return json.dumps({"users": users})


class UsersOperationService:

    @staticmethod
    def get_user_by_id(user_id):
        with DatabaseManager() as connection:
            with connection.cursor() as cur:
                cur.execute(sql_stmt['get_user_by_id'], {'id': user_id})
                user = cur.fetchone()

        if not user:
            raise UserNotExists

        return json.dumps(user)

    @staticmethod
    def validate_authorised_user(user_id):
        token_details = get_jwt()
        if token_details['user_id'] != user_id:
            raise UnauthorisedException

    def update_user_by_id(self, user_id, user_data):
        self.validate_authorised_user(user_id)
        user = {
            'id': user_id,
            "first_name": user_data['first_name'],
            "last_name": user_data['last_name']

        }
        with DatabaseManager() as connection:
            with connection.cursor() as cur:
                cur.execute(sql_stmt['update_user_by_id'], user)
            connection.commit()
        return json.dumps({"ok": True})

    def delete_user_by_id(self, user_id):
        self.validate_authorised_user(user_id)

        with DatabaseManager() as connection:
            with connection.cursor() as cur:
                result = cur.execute(sql_stmt['delete_user_by_id'], {'id': user_id})
            connection.commit()

        if not result:
            raise UserNotExists

        return json.dumps({"ok": True})
