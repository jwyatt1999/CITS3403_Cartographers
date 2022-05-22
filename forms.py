from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, BooleanField, SubmitField
from wtforms.validators import ValidationError, DataRequired, Email, EqualTo
from models import User, Scorecard, Scorelist

#Class to hold elements and validators for registration form
class RegistrationForm(FlaskForm):
    username = StringField('Username', validators=[DataRequired()])
    email = StringField('Email', validators=[DataRequired()])
    password = PasswordField('Password', validators=[DataRequired()])
    password2 = PasswordField('Repeat Password', validators=[DataRequired(), EqualTo('password')])
    submit = SubmitField('Register')

#Class to hold elements and validators for login form 
class LoginForm(FlaskForm):
    username = StringField('Username', validators=[DataRequired()], id="usernameForm")
    password = PasswordField('Password', validators=[DataRequired()], id="passwordForm")
    remember_me = BooleanField('Remember Me')
    submit = SubmitField('Sign In', id="signInButton")