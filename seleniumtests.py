import unittest, os, time
from app import app, db
from models import User, Scorecard, Scorelist
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

class SystemTest(unittest.TestCase):
    driver = None

    def setUp(self):
        #This uses chromedriver.exe v101.0.4951.41, and expects chromedriver.exe to be installed and located in the root Cartographers folder
        self.driver = webdriver.Chrome(executable_path="chromedriver.exe")
        if not self.driver:
            self.skipTest("Web browser not available")
        else:
            app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///myDB.db'
            db.drop_all()
            db.create_all()
            #Set up test users
            u1 = User(username='test1', email='test1@gmail.com')
            u1.set_password('testPass1')
            u2 = User(username='test2', email='test2@gmail.com')
            u2.set_password('testPass2')
            u3 = User(username='test3', email='test3@gmail.com')
            u3.set_password('testPass3')
            db.session.add(u1)
            db.session.add(u2)
            db.session.add(u3)
            db.session.commit()
            #Set up score lists
            s1 = Scorelist(user_id = u1.id)
            s2 = Scorelist(user_id = u2.id)
            s3 = Scorelist(user_id = u3.id)
            db.session.add(s1)
            db.session.add(s2)
            db.session.add(s3)
            db.session.commit()
            #Set up score cards
            s1_1 =  Scorecard(score=5, uname=u1.username, scorelist_id=u1.scorelists.id, type=1)
            s1_2 =  Scorecard(score=10, uname=u1.username, scorelist_id=u1.scorelists.id, type=1)
            s1_3 =  Scorecard(score=15, uname=u1.username, scorelist_id=u1.scorelists.id, type=1)
            s1_4 =  Scorecard(score=20, uname=u1.username, scorelist_id=u1.scorelists.id, type=2)
            s1_5 =  Scorecard(score=25, uname=u1.username, scorelist_id=u1.scorelists.id, type=2)
            s1_6 =  Scorecard(score=30, uname=u1.username, scorelist_id=u1.scorelists.id, type=2)
            s2_1 =  Scorecard(score=5, uname=u2.username, scorelist_id=u2.scorelists.id, type=1)
            s2_2 =  Scorecard(score=20, uname=u2.username, scorelist_id=u2.scorelists.id, type=1)
            s2_3 =  Scorecard(score=15, uname=u2.username, scorelist_id=u2.scorelists.id, type=1)
            s2_4 = Scorecard(score=20, uname=u2.username, scorelist_id=u2.scorelists.id, type=2)
            s2_5 = Scorecard(score=25, uname=u2.username, scorelist_id=u2.scorelists.id, type=2)
            s2_6 = Scorecard(score=45, uname=u2.username, scorelist_id=u2.scorelists.id, type=2)
            s3_1 =  Scorecard(score=10, uname=u3.username, scorelist_id=u3.scorelists.id, type=1)
            s3_2 =  Scorecard(score=10, uname=u3.username, scorelist_id=u3.scorelists.id, type=1)
            s3_3 =  Scorecard(score=40, uname=u3.username, scorelist_id=u3.scorelists.id, type=1)
            s3_4 = Scorecard(score=25, uname=u3.username, scorelist_id=u3.scorelists.id, type=2)
            s3_5 = Scorecard(score=30, uname=u3.username, scorelist_id=u3.scorelists.id, type=2)
            s3_6 = Scorecard(score=50, uname=u3.username, scorelist_id=u3.scorelists.id, type=2)
            db.session.add(s1_1)
            db.session.add(s1_2)
            db.session.add(s1_3)
            db.session.add(s1_4)
            db.session.add(s1_5)
            db.session.add(s1_6)
            db.session.add(s2_1)
            db.session.add(s2_2)
            db.session.add(s2_3)
            db.session.add(s2_4)
            db.session.add(s2_5)
            db.session.add(s2_6)
            db.session.add(s3_1)
            db.session.add(s3_2)
            db.session.add(s3_3)
            db.session.add(s3_4)
            db.session.add(s3_5)
            db.session.add(s3_6)
            db.session.commit()
            self.driver.maximize_window()
            self.driver.get('http://127.0.0.1:5000/')

    def tearDown(self):
        if self.driver:
            self.driver.close()
            db.session.query(Scorecard).delete()
            db.session.query(Scorelist).delete()
            db.session.query(User).delete()
            db.session.commit()
            db.session.remove()

    #Test that registration functionality works as expected
    def test_registration(self):
        #Register new user
        self.driver.get('http://127.0.0.1:5000/register')
        self.driver.implicitly_wait(5)
        username_form = self.driver.find_element_by_id('username')
        username_form.send_keys('newTestUser')
        email_form = self.driver.find_element_by_id('email')
        email_form.send_keys('testEmail@test.com')  
        password_form = self.driver.find_element_by_id('password')
        password_form.send_keys('testPassword')  
        password2_form = self.driver.find_element_by_id('password2')
        password2_form.send_keys('testPassword') 
        self.driver.implicitly_wait(5)
        register_button = self.driver.find_element_by_id('submit')
        register_button.click()
        self.driver.implicitly_wait(5)
        #Check that we have been returned to the login page
        self.assertEqual(self.driver.current_url, "http://127.0.0.1:5000/login")
        #Attempt to log in with our registered details
        username_form = self.driver.find_element_by_id('usernameForm')
        username_form.send_keys('newTestUser')   
        password_form = self.driver.find_element_by_id('passwordForm')
        password_form.send_keys('testPassword')
        self.driver.implicitly_wait(5)
        sign_in_button = self.driver.find_element_by_id('signInButton')
        sign_in_button.click()
        self.driver.implicitly_wait(5)
        #Check that we are logged in
        self.assertEqual(self.driver.current_url, "http://127.0.0.1:5000/")
        return

    #...
    def test_gameFunction(self):
        #start at main page
        #if there is a button that says 'Logout' then press that button
        #press button that says 'Login'
        #enter the username 'test' and password 'testPass' and click the button that says 'Sign In'
        #navigate to /game/test (which has a set seed)
        #confirm scorecards are correct
        #move and change the season 1 pieces using on-screen buttons, check the points match up with the expected points, if not then something failed
            #test surrounding mountains and gaining a coin
            #test gaining coins from pieces
            #test losing points from enemies
        #move and change the season 2 and 3 pieces using arrow keys and letters, check the points match up with the expected points at the end of each season, if not then something failed
            #test placing pieces in illegal places (trying to move it off the board, placing it over other pieces, trying to rotate it off the board)
        #ensure a button is shown that says 'start new freeplay game'
        self.assertEqual(Scorelist.query.count(), 3)

    #Test that the random initial gameboard has the correct features 
    def test_gameGeneration(self):       
        #Login
        self.driver.get('http://127.0.0.1:5000/login')
        self.driver.implicitly_wait(5)
        username_form = self.driver.find_element_by_id('usernameForm')
        username_form.send_keys('test1')   
        password_form = self.driver.find_element_by_id('passwordForm')
        password_form.send_keys('testPass1')
        self.driver.implicitly_wait(5)
        sign_in_button = self.driver.find_element_by_id('signInButton')
        sign_in_button.click()
        self.driver.implicitly_wait(5)
        #Check that we are logged in
        self.assertEqual(self.driver.current_url, "http://127.0.0.1:5000/")
        #Go to daily game page
        self.driver.get('http://127.0.0.1:5000/game/daily')
        self.driver.implicitly_wait(5)
        #Count the number of mountain, blocked, and overlap spaces. This should be equal to 5
        visible_mountains = len(self.driver.find_elements_by_name('mountain'))
        visible_blocked = len(self.driver.find_elements_by_name('blocked'))
        overlap = len(self.driver.find_elements_by_name('overlap'))
        self.assertEqual((visible_mountains + visible_blocked + overlap), 5)
        #Check that among the first 3 scorecards there is a Forest scorecard (g), a Village scorecard (r), and a Farm-River scorecard (l)
        #We want the index 12 character because we expect the styles to be "Background: type", and the first letter of "type" is sufficient
        #to differentiate the cards.
        scorecard1 = self.driver.find_element_by_id('scoreCard1')
        scorecard1_type = scorecard1.get_attribute("style")[12]
        scorecard2 = self.driver.find_element_by_id('scoreCard2')
        scorecard2_type = scorecard2.get_attribute("style")[12]
        scorecard3 = self.driver.find_element_by_id('scoreCard3')
        scorecard3_type = scorecard3.get_attribute("style")[12]
        present_types = scorecard1_type + scorecard2_type + scorecard3_type
        self.assertTrue(present_types.find("g") != -1)
        self.assertTrue(present_types.find("r") != -1)
        self.assertTrue(present_types.find("l") != -1)
        #Check that the 4th scorecard is a Placement scorecard, this can be identified by having "type" = "grey"
        scorecard4 = self.driver.find_element_by_id('scoreCard4')
        scorecard4_type = scorecard4.get_attribute("style")[12:16]
        self.assertEqual(scorecard4_type, "grey")
        return
        
    #Test that the leaderboard shows scores from all users and the profile page shows score for the signed in user
    def test_leaderboardAndProfile(self):
        #Login
        self.driver.get('http://127.0.0.1:5000/login')
        self.driver.implicitly_wait(5)
        username_form = self.driver.find_element_by_id('usernameForm')
        username_form.send_keys('test1')   
        password_form = self.driver.find_element_by_id('passwordForm')
        password_form.send_keys('testPass1')
        self.driver.implicitly_wait(5)
        sign_in_button = self.driver.find_element_by_id('signInButton')
        sign_in_button.click()
        self.driver.implicitly_wait(5)
        #Check that we are logged in
        self.assertEqual(self.driver.current_url, "http://127.0.0.1:5000/")
        #Navigate to profile page
        self.driver.get('http://127.0.0.1:5000/user/test1')
        self.driver.implicitly_wait(5)
        

        #ensure daily button is selected and shows results I would expect from what I have set for this user
        #click freeplay button and ensure it shows results I would expect from what I have set for this user
        #click leaderboard button
        #ensure daily button is selected and shows results I would expect from what I have set for this user and the other user
        #clock freeplay button and ensure it shows results I would expect from what I have set for this user and the other user
        self.assertEqual(Scorecard.query.count(), 18)

    #Test that the login and logout functionality works as expected
    def test_loginAndLogout(self):
        #Login
        self.driver.get('http://127.0.0.1:5000/login')
        self.driver.implicitly_wait(5)
        username_form = self.driver.find_element_by_id('usernameForm')
        username_form.send_keys('test1')   
        password_form = self.driver.find_element_by_id('passwordForm')
        password_form.send_keys('testPass1')
        self.driver.implicitly_wait(5)
        sign_in_button = self.driver.find_element_by_id('signInButton')
        sign_in_button.click()
        self.driver.implicitly_wait(5)
        #Check that we are logged in
        self.assertEqual(self.driver.current_url, "http://127.0.0.1:5000/")
        #Logout
        logout_button = self.driver.find_element_by_link_text('Logout')
        logout_button.click()
        self.driver.implicitly_wait(5)
        #Check that we have been returned to the login page
        self.assertEqual(self.driver.current_url, "http://127.0.0.1:5000/login")
        #Attempt to access the leaderboard (requires the user to be logged in)
        leaderboard_button = self.driver.find_element_by_link_text('Leaderboard')
        leaderboard_button.click()
        self.driver.implicitly_wait(5)
        #Check that we have been prevented from accessing the leaderboard
        self.assertNotEqual(self.driver.current_url, "http://127.0.0.1:5000/leaderboard")
        return

if __name__=='__main__':
    unittest.main(verbosity=2)