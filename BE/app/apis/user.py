from flask_restful import Resource
from flask import request, Response
from flask_jwt_extended import jwt_required

from app.services.user import UserRegistration, UserLoginService, UserListingService, UsersOperationService

__all__ = ['UserRegister', 'UserLogin', 'UsersListing', 'UsersOperation']


class UserRegister(Resource):

    @staticmethod
    def post():
        """ This API method is used to register a user in system """

        response = UserRegistration(request.json).do_process()
        return Response(response, status=201, content_type='application/json')


class UserLogin(Resource):

    @staticmethod
    def post():
        """ This API method is used to log-in user into system """

        response = UserLoginService(request.json).do_process()
        return Response(response, status=200, content_type='application/json')


class UsersListing(Resource):

    @staticmethod
    def get():
        """ This API method is get all the users """

        response = UserListingService().do_process()
        return Response(response, status=200, content_type='application/json')


class UsersOperation(Resource):

    @staticmethod
    def get(user_id):
        """ This API is used to get users by ID """

        response = UsersOperationService().get_user_by_id(user_id)
        return Response(response, status=200, content_type='application/json')

    @staticmethod
    @jwt_required()
    def put(user_id):
        """ This API is used to update user details by ID """

        response = UsersOperationService().update_user_by_id(user_id, request.json)
        return Response(response, status=200, content_type='application/json')

    @staticmethod
    @jwt_required()
    def delete(user_id):
        """ This API is used to get users by ID """

        response = UsersOperationService().delete_user_by_id(user_id)
        return Response(response, status=200, content_type='application/json')
