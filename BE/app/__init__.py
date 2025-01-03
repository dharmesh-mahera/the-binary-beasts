from flask import Flask
from flask_restful import Api
from flask_jwt_extended import JWTManager

from app.config import configure_app
from app.common.errors import errors

app = Flask("Social-media")
api = Api(app, errors=errors)
configure_app(app)

JWTManager(app)

from app.apis import *
import app.common.constant as const

api.add_resource(UserRegister, const.USER_REGISTRATION)
api.add_resource(UserLogin, const.USER_LOGIN)
api.add_resource(UsersListing, const.GET_USERS)
api.add_resource(UsersOperation, const.USER_OPERATION_BY_ID)

api.add_resource(Posts, const.GET_CREATE_POST)
api.add_resource(PostsOperations, const.GET_UPDATE_DELETE_POST_BY_ID)


api.add_resource(PostsLike, const.POST_LIKE)
api.add_resource(PostComment, const.POST_COMMENT)
