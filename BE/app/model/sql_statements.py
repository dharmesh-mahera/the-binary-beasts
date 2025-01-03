import os
from io import StringIO
from configparser import ConfigParser

with open('app/model/sql.properties') as fp:
    config = StringIO()
    config.write('[dummy_section]\n')
    config.write(fp.read().replace('%', '%%'))
    config.seek(0, os.SEEK_SET)
    cp = ConfigParser()
    cp.read_file(config)
    sql_stmt = dict(cp.items('dummy_section'))
