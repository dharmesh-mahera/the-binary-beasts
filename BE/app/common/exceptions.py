class BusinessException(Exception):
    pass


class UserAlreadyExists(BusinessException):
    pass


class UserNotExists(BusinessException):
    pass


class InvalidPassword(BusinessException):
    pass


class UnauthorisedException(BusinessException):
    pass


class PostNotExists(BusinessException):
    pass

