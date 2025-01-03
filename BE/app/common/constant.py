# User Endpoints

USER_REGISTRATION = "/user/register"
USER_LOGIN = "/user/login"
GET_USERS = "/users"
USER_OPERATION_BY_ID = "/users/<int:user_id>"

# Post Endpoints
GET_CREATE_POST = "/posts"
GET_UPDATE_DELETE_POST_BY_ID = "/posts/<int:post_id>"
POST_LIKE = "/posts/<int:post_id>/like"
POST_COMMENT = "/posts/<int:post_id>/comments"
