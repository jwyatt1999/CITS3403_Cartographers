from app import db
from models import User, Scorelist, Scorecard
from random import seed
from random import randint
from datetime import datetime

def addScoreCards():
    user1 = User(username='DemoUser1', email='demo1@gmail.com')
    user2 = User(username='DemoUser2', email='demo2@gmail.com')
    user3 = User(username='DemoUser3', email='demo3@gmail.com')
    user1.set_password('Pass1')
    user2.set_password('Pass1')
    user3.set_password('Pass1')
    db.session.add(user1)
    db.session.add(user2)
    db.session.add(user3)
    db.session.commit()

    scorelist1 = Scorelist(user_id = user1.id)
    scorelist2 = Scorelist(user_id = user2.id)
    scorelist3 = Scorelist(user_id = user3.id)
    db.session.add(scorelist1)
    db.session.add(scorelist2)
    db.session.add(scorelist3)
    db.session.commit()

    i = 1

    while i < 22:
        if i < 10:
            date_string = "2022-05-0" + str(i)
        else:
            date_string = "2022-05-" + str(i)

        date_obj = datetime.fromisoformat(date_string).date()
        new_scorecard1 = Scorecard(score=randint(0,50), uname=user1.username, date=date_obj, scorelist_id=user1.scorelists.id, type=1)
        new_scorecard2 = Scorecard(score=randint(0,50), uname=user1.username, date=date_obj, scorelist_id=user1.scorelists.id, type=2)
        new_scorecard3 = Scorecard(score=randint(0,50), uname=user1.username, date=date_obj, scorelist_id=user1.scorelists.id, type=2)
    
        new_scorecard4 = Scorecard(score=randint(0,50), uname=user2.username, date=date_obj, scorelist_id=user2.scorelists.id, type=1)
        new_scorecard5 = Scorecard(score=randint(0,50), uname=user2.username, date=date_obj, scorelist_id=user2.scorelists.id, type=2)
        new_scorecard6 = Scorecard(score=randint(0,50), uname=user2.username, date=date_obj, scorelist_id=user2.scorelists.id, type=2)

        new_scorecard7 = Scorecard(score=randint(0,50), uname=user3.username, date=date_obj, scorelist_id=user3.scorelists.id, type=1)
        new_scorecard8 = Scorecard(score=randint(0,50), uname=user3.username, date=date_obj, scorelist_id=user3.scorelists.id, type=2)
        new_scorecard9 = Scorecard(score=randint(0,50), uname=user3.username, date=date_obj, scorelist_id=user3.scorelists.id, type=2)

        db.session.add(new_scorecard1)
        db.session.add(new_scorecard2)
        db.session.add(new_scorecard3)
        db.session.add(new_scorecard4)
        db.session.add(new_scorecard5)
        db.session.add(new_scorecard6)
        db.session.add(new_scorecard7)
        db.session.add(new_scorecard8)
        db.session.add(new_scorecard9)

        db.session.commit()

        i += 1

    return

addScoreCards()