from email.policy import default
from enum import unique
from app import db, login
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin
from sqlalchemy.sql import func
 
class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(64), index=True, unique=True)
    email = db.Column(db.String(120), index=True, unique=True)
    password_hash = db.Column(db.String(128))
    scorelist_freeplay = db.relationship('Scorelist', backref='user', uselist=False)

    def __repr__(self):
        return '<User {}>'.format(self.username)
 
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)
 
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    @login.user_loader
    def load_user(id):
        return User.query.get(int(id))

class Scorecard(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    score = db.Column(db.Integer, index = True, unique=False)
    uname = db.Column(db.String(64), index=True, unique=False)
    date = db.Column(db.DateTime(), default=func.now())
    scorelist_id = db.Column(db.Integer, db.ForeignKey('scorelist.id'))

    def __repr__(self):
        return "{} scored {} points".format(self.uname, self.score)


class Scorelist(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    scorecards = db.relationship('Scorecard', backref='scorelist', lazy='dynamic')




