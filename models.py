from email.policy import default
from enum import unique
from app import db, login
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin
from sqlalchemy.sql import func
from datetime import datetime

#User model takes a username, email and password hash. Scorelists will be added on creation
class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(64), index=True, unique=True)
    email = db.Column(db.String(120), index=True, unique=True)
    password_hash = db.Column(db.String(128))
    scorelists = db.relationship('Scorelist', backref='user', uselist=False)

    #Method to return the representation of a user
    def __repr__(self):
        return '<User {}>'.format(self.username)
    
    #Method to generate a hash from a given password, no plaintext passwords will be stored
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)
    
    #Method to determine if the entered password matches the existing hash
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    #Allows login to get user from database given its id
    #Will be stored as current user to be used by other routes
    @login.user_loader
    def load_user(id):
        return User.query.get(int(id))
    
    #Returns a list of scorecards for daily games sorted by date
    def daily_scorecards(self):
        return self.scorelists.scorecards.filter(Scorecard.type == 1).order_by(Scorecard.date.desc())
        
    #Returns a list of scorecards for freeplay games sorted by date
    def freeplay_scorecards(self):
        return self.scorelists.scorecards.filter(Scorecard.type == 2).order_by(Scorecard.date.desc())
    
    #Returns the highest scorecard in daily mode
    def daily_highscore(self):
        return self.scorelists.scorecards.filter(Scorecard.type == 1).order_by(Scorecard.score.desc()).first()

    #Returns the highest scorecard in freeplay mode
    def freeplay_highscore(self):
        return self.scorelists.scorecards.filter(Scorecard.type == 2).order_by(Scorecard.score.desc()).first()

#Scorecard model tracks users scores in the game, dates are populated automatically according to server time
class Scorecard(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    score = db.Column(db.Integer, index = True, unique=False)
    uname = db.Column(db.String(64), index=True, unique=False)
    date = db.Column(db.Date(), default=datetime.now().date())
    type = db.Column(db.Integer, index = True)
    scorelist_id = db.Column(db.Integer, db.ForeignKey('scorelist.id'))

    #Method to return the representation of a scorecard
    def __repr__(self):
        return "{} scored {} points on {}".format(self.uname, self.score, self.date)
    
#Scorelist model links users with their scorecards
class Scorelist(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    scorecards = db.relationship('Scorecard', backref='scorelist', lazy='dynamic')
