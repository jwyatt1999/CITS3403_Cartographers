from app import db
from models import User, Scorelist, Scorecard

user1 = User(username='JooKai', email='joo1@gmail.com')
user1.set_password('Pass1')
db.session.add(user1)
scorelist1 = Scorelist(user_id = user1.id)
db.session.add(scorelist1)
new_scorecard = Scorecard(score=5, uname=user1.username, scorelist_id=user1.scorelists.id, type=1)
new_scorecard = Scorecard(score=5, uname=user1.username, scorelist_id=user1.scorelists.id, type=2)
db.session.add(new_scorecard)

user2 = User(username='JooKai2', email='joo2@gmail.com')
user2.set_password('Pass1')
db.session.add(user2)
scorelist2 = Scorelist(user_id = user2.id)
db.session.add(scorelist2)
new_scorecard = Scorecard(score=10, uname=user2.username, scorelist_id=user2.scorelists.id, type=1)
new_scorecard = Scorecard(score=10, uname=user2.username, scorelist_id=user2.scorelists.id, type=2)
db.session.add(new_scorecard)

user3 = User(username='JooKai', email='joo3@gmail.com')
user3.set_password('Pass1')
db.session.add(user3)
scorelist3 = Scorelist(user_id = user3.id)
db.session.add(scorelist3)
new_scorecard = Scorecard(score=15, uname=user3.username, scorelist_id=user3.scorelists.id, type=1)
new_scorecard = Scorecard(score=15, uname=user3.username, scorelist_id=user3.scorelists.id, type=2)
db.session.add(new_scorecard)

db.session.commit()