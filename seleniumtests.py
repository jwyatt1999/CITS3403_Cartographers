import unittest, os, time
from app import app, db
from app.models import User
from selenium import webdriver

class SystemTest(unittest.TestCase):
    driver = None

    def setUp(self):
        #This uses chromedriver.exe v101.0.4951.41, and expects chromedriver.exe to be in the root Cartographers folder
        self.driver = webdriver.Chrome(executable_path="chromedriver.exe")

        if not self.driver:
            self.skipTest("Web browser not available")
        else:
            app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///'
            db.create_all()
            u1 = User(id=1, username='test1', email='test1@gmail.com')
            u2 = User(id=2, username='test2', email='test2@gmail.com')
            db.session.add(u1)
            db.session.add(u2)
            db.session.commit()
            self.driver.maximize_window()
            self.driver.get('http://localhost:5000/')

    def tearDown(self):
        if self.driver:
            self.driver.close()
            db.session.remove()
            db.drop_all()

    def test_registration(self):
    
    def test_login(self):

    def test_daily(self):

    def test_leaderboard(self):

    def test_logout(self):

if __name__=='__main__':
    unittest.main(verbosity=2)