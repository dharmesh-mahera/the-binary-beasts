errors = {
    "UserAlreadyExists": {
        "ok": False,
        "message": "User with same email already exists",
        "status": 409
    },
    "UserNotExists": {
        "ok": False,
        "message": "User does not exists!",
        "status": 404
    },
    "InvalidPassword": {
        "ok": False,
        "message": "Invalid Password!",
        "status": 400
    },
    "UnauthorisedException": {
        "ok": False,
        "message": "You do not have to perform this activity!",
        "status": 403
    },
    "NoAuthorizationError": {
        "ok": False,
        "message": "Unauthenticated!, Missing Authorization Header!",
        "status": 401
    },
    "PostNotExists": {
        "ok": False,
        "message": "Post not found!",
        "status": 404
    },
    "ExpiredSignatureError": {
        "ok": False,
        "message": "Session Expired!! Login again",
        "status": 401
    },
}
