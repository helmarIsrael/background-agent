from flask import Flask
from flask_mysql_connector import MySQL
from config import DB_NAME, DB_HOST, DB_USERNAME, SECRET_KEY
app = Flask(__name__)


app.config['MYSQL_USER'] = DB_USERNAME
# app.config['MYSQL_PASSWORD'] = DB_PASSWORD
app.config['MYSQL_DATABASE'] = DB_NAME
app.config['MYSQL_HOST'] = DB_HOST
app.config['SECRET_KEY'] = SECRET_KEY

mysql = MySQL(app)

from mckeskwela_app import routes