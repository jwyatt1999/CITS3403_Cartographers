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

    def test_password_hashing(self):
        u = User(username='JooKai', email='joo@gmail.com')
        u.set_password('Pass1')
        self.assertFalse(u.check_password('notAPassword'))
        self.assertTrue(u.check_password('Pass1'))
    
    def test_add_scorelist(self):
       u1 = User(username='JooKai', email='joo@gmail.com')
       u2 = User(username='Josh', email='josh@gmail.com')
       db.session.add(u1)
       db.session.add(u2)
       db.session.commit()
       self.assertEqual(u1.scorelists.all(), [])
       self.assertEqual(u1.scorelists.all(), []) 
    
if __name__ == '__main__':
    unittest.main(verbosity=2)