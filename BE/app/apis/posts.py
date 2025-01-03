from flask_restful import Resource
from flask import request, Response
from flask_jwt_extended import jwt_required

from app.services.posts import PostsService, PostsOperationService, PostLikeService, PostCommentService

__all__ = ['Posts', 'PostsOperations', "PostsLike", "PostComment"]


class Posts(Resource):

    @staticmethod
    def get():
        """ This API method is used to list all the posts """
        response = PostsService().get_all_posts()
        return Response(response, status=200, content_type='application/json')

    @jwt_required()
    def post(self):
        """ This API is used to create a post """
        response = PostsService().create_post(request.json)
        return Response(response, status=201, content_type='application/json')


class PostsOperations(Resource):
    def get(self, post_id):
        """ This API is used to get a post by ID """
        response = PostsOperationService().get_post_by_id(post_id)
        return Response(response, status=200, content_type='application/json')

    @jwt_required()
    def put(self, post_id):
        """ This API is used to update a post by ID """
        response = PostsOperationService().update_post_by_id(post_id, request.json)
        return Response(response, status=200, content_type='application/json')

    @jwt_required()
    def delete(self, post_id):
        """ This API is used to delete a post by ID """
        response = PostsOperationService().delete_post_by_id(post_id)
        return Response(response, status=200, content_type='application/json')


class PostsLike(Resource):

    @jwt_required()
    def post(self, post_id):
        """ This API is used add like on a post """
        response = PostLikeService().do_process(post_id)
        return Response(response, status=200, content_type='application/json')


class PostComment(Resource):

    @jwt_required()
    def post(self, post_id):
        """ This API is used to comment on a post """
        response = PostCommentService().do_process(post_id, request.json['comment'])
        return Response(response, status=200, content_type='application/json')
