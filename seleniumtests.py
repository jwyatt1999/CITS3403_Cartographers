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
            u = User(username='test', email='test@gmail.com')
            u.set_password('testPass')
            db.session.add(u)
            db.session.commit()
            self.driver.maximize_window()
            self.driver.get('http://localhost:5000/')

    def tearDown(self):
        if self.driver:
            self.driver.close()
            db.session.remove()
            db.drop_all()

    def test_registrationAndLogin(self):
        #start at main page
        #if there is a button that says 'Logout' then press that button
        #press button that says 'Login'
        #press button that says 'Click to Register!'
        #fill in username, email, password, repeat password, then click button that says 'Register'
        #enter the username and password we used to register and click the button that says 'Sign In'
        #if there is a button that says 'Logout' then we pass, if not then registration/login failed

    def test_game(self):
        #start at main page
        #if there is a button that says 'Logout' then press that button
        #press button that says 'Login'
        #enter the username 'test' and password 'testPass' and click the button that says 'Sign In'
        #press hidden button to go to /game/test (which has a set seed)
        #confirm scorecards are correct
        #move and change the season 1 pieces using on-screen buttons, check the points match up with the expected points, if not then something failed
            #make sure to 
        #move and change the season 2 and 3 pieces using arrow keys and letters, check the points match up with the expected points at the end of each season, if not then something failed
        #


    def test_leaderboard(self):

    def test_logout(self):

if __name__=='__main__':
    unittest.main(verbosity=2)