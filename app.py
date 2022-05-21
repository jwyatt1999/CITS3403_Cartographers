from os import environ
from distutils.log import info
from flask import Flask, render_template, request, url_for
from flask_wtf import FlaskForm
from wtforms import StringField, SubmitField
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager

app = Flask(__name__)
app.config['SECRET_KEY'] = 'mysecret'
uri = environ.get('DATABASE_URL') or 'sqlite:///myDB.db'
if uri and uri.startswith("postgres://"):
    uri = uri.replace("postgres://", "postgresql://", 1)
app.config['SQLALCHEMY_DATABASE_URI'] = uri
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

login = LoginManager(app)
login.login_view = 'login'

import models, routes, errors

# Used to initalize database
db.create_all()
