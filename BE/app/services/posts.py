import json

from flask_jwt_extended import get_jwt

from app.common.exceptions import UserNotExists, PostNotExists, UnauthorisedException
from app.model.database_manager import DatabaseManager
from app.model.sql_statements import sql_stmt
from pymysql.err import IntegrityError


class PostsService:

    @staticmethod
    def get_all_posts():
        with DatabaseManager() as connection:
            with connection.cursor() as cur:
                cur.execute(sql_stmt['list_posts'])
                posts = cur.fetchall()

        return json.dumps({"posts": posts})

    @staticmethod
    def create_post(data):
        post = {
            "name": data['name'],
            "description": data['description'],
            "author_id": get_jwt()['user_id']
        }

        try:
            with DatabaseManager() as connection:
                with connection.cursor() as cur:
                    cur.execute(sql_stmt['create_post'], post)
                    post_id = cur.lastrowid
                connection.commit()
            return json.dumps({"post_id": post_id})
        except IntegrityError:
            raise UserNotExists


class PostsOperationService:

    @staticmethod
    def get_post_by_id(post_id):
        with DatabaseManager() as connection:
            with connection.cursor() as cur:
                cur.execute(sql_stmt['get_post_by_id'], {'id': post_id})
                post = cur.fetchone()

        if not post:
            raise PostNotExists

        return json.dumps(post)

    @staticmethod
    def validate_authorised_user(post):
        token_details = get_jwt()
        if int(token_details['user_id']) != int(post['author_id']):
            raise UnauthorisedException

    def update_post_by_id(self, post_id, post_data):
        post = json.loads(self.get_post_by_id(post_id))
        self.validate_authorised_user(post)
        post = {
            "id": post_id,
            "name": post_data['name'],
            "description": post_data['description']

        }
        with DatabaseManager() as connection:
            with connection.cursor() as cur:
                cur.execute(sql_stmt['update_posts_by_id'], post)
            connection.commit()
        return json.dumps({"ok": True})

    def delete_post_by_id(self, post_id):
        post = json.loads(self.get_post_by_id(post_id))
        self.validate_authorised_user(post)

        with DatabaseManager() as connection:
            with connection.cursor() as cur:
                cur.execute(sql_stmt['delete_post_by_id'], {'id': post_id})
            connection.commit()

        return json.dumps({"ok": True})


class PostLikeService:
    @staticmethod
    def do_process(post_id):
        post_like = {"post_id": post_id, "liker_id": get_jwt()['user_id']}
        try:
            with DatabaseManager() as connection:
                with connection.cursor() as cur:
                    cur.execute(sql_stmt['add_like'], post_like)
                connection.commit()

            return json.dumps({"ok": True})
        except IntegrityError:
            raise PostNotExists


class PostCommentService:
    @staticmethod
    def do_process(post_id, comment):
        try:
            comment_data = {"post_id": post_id, "commenter_id": get_jwt()['user_id'], "comment": comment}
            with DatabaseManager() as connection:
                with connection.cursor() as cur:
                    cur.execute(sql_stmt['add_comment'], comment_data)
                connection.commit()

            return json.dumps({"ok": True})
        except IntegrityError:
            raise PostNotExists

