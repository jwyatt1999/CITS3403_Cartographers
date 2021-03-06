from datetime import datetime, timedelta
import unittest
from app import app, db
from models import User, Scorecard, Scorelist

class UserModelCase(unittest.TestCase):
    
    def setUp(self):
       app.config['SQLALCHEMY_DATABASE_URI'] =  'sqlite:///'
       db.create_all()
    
    def tearDown(self):
        db.session.remove()
        db.drop_all()

    #Test that the password checking works as expected
    def test_password_hashing(self):
        u = User(username='user1', email='test1@gmail.com')
        u.set_password('Pass1')
        self.assertFalse(u.check_password('notAPassword'))
        self.assertTrue(u.check_password('Pass1'))
    
    #Test that scorelists are correctly added to users in the database
    def test_add_scorelist(self):
        u1 = User(username='user1', email='test1@gmail.com')
        u2 = User(username='user2', email='test2@gmail.com')
        db.session.add(u1)
        db.session.add(u2)
        db.session.commit()

        s1 = Scorelist(user_id = u1.id)
        s2 = Scorelist(user_id = u2.id)
        db.session.add(s1)
        db.session.add(s2)
        db.session.commit()

        self.assertEqual(u1.scorelists, s1)
        self.assertEqual(u2.scorelists, s2)

    #Test that scorecards are correctly added to users' scorelists in the database
    def test_add_scorecards(self):
        u1 = User(username='user1', email='test1@gmail.com')
        u2 = User(username='user2', email='test2@gmail.com')
        db.session.add(u1)
        db.session.add(u2)
        db.session.commit()

        s1 = Scorelist(user_id = u1.id)
        s2 = Scorelist(user_id = u2.id)
        db.session.add(s1)
        db.session.add(s2)
        db.session.commit()

        c1 =  Scorecard(score=5, uname=u1.username, scorelist_id=u1.scorelists.id, type=1)
        c2 =  Scorecard(score=10, uname=u1.username, scorelist_id=u1.scorelists.id, type=1)
        c3 =  Scorecard(score=15, uname=u1.username, scorelist_id=u1.scorelists.id, type=1)
        c4 =  Scorecard(score=20, uname=u1.username, scorelist_id=u1.scorelists.id, type=2)
        c5 =  Scorecard(score=25, uname=u1.username, scorelist_id=u1.scorelists.id, type=2)
        c6 =  Scorecard(score=30, uname=u1.username, scorelist_id=u1.scorelists.id, type=2)

        c7 =  Scorecard(score=5, uname=u2.username, scorelist_id=u2.scorelists.id, type=1)
        c8 =  Scorecard(score=20, uname=u2.username, scorelist_id=u2.scorelists.id, type=1)
        c9 =  Scorecard(score=15, uname=u2.username, scorelist_id=u2.scorelists.id, type=1)
        c10 = Scorecard(score=20, uname=u2.username, scorelist_id=u2.scorelists.id, type=2)
        c11 = Scorecard(score=25, uname=u2.username, scorelist_id=u2.scorelists.id, type=2)
        c12 = Scorecard(score=45, uname=u2.username, scorelist_id=u2.scorelists.id, type=2)
        
        db.session.add(c1)
        db.session.add(c2)
        db.session.add(c3)
        db.session.add(c4)
        db.session.add(c5)
        db.session.add(c6)
        db.session.add(c7)
        db.session.add(c8)
        db.session.add(c9)
        db.session.add(c10)
        db.session.add(c11)
        db.session.add(c12)
        db.session.commit()

        #Tests that the methods found in models.py work as intended
        self.assertEqual(u1.scorelists.scorecards.all(), [c1,c2,c3,c4,c5,c6])
        self.assertEqual(u2.scorelists.scorecards.all(), [c7,c8,c9,c10,c11,c12])

        self.assertEqual(u1.daily_scorecards().all(), [c1,c2,c3])
        self.assertEqual(u1.freeplay_scorecards().all(), [c4,c5,c6])

        self.assertEqual(u2.daily_scorecards().all(), [c7,c8,c9])
        self.assertEqual(u2.freeplay_scorecards().all(), [c10,c11,c12])

        self.assertEqual(u1.daily_highscore().score, 15)
        self.assertEqual(u1.freeplay_highscore().score, 30)

        self.assertEqual(u2.daily_highscore().score, 20)
        self.assertEqual(u2.freeplay_highscore().score, 45)

    
if __name__ == '__main__':
    unittest.main(verbosity=2)