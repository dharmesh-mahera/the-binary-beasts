import datetime
import os


def configure_app(app):
    app.config['JWT_SECRET_KEY'] = os.environ.get('JWT_SECRET_KEY')
    app.config['JTW_ACCESS_TOKEN_EXPIRES'] = datetime.timedelta(hours=1)

    # MySQL configuration
    app.config['MYSQL_HOST'] = os.environ.get('MYSQL_HOST')
    app.config['MYSQL_USER'] = os.environ.get('MYSQL_USER')
    app.config['MYSQL_PASSWORD'] = os.environ.get('MYSQL_PASSWORD')
    app.config['MYSQL_DATABASE'] = os.environ.get('MYSQL_DATABASE')

