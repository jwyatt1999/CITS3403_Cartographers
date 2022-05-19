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

    #Test that the various game functions work as expected
    def test_gameFunction(self):
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
        #Go to test game page
        self.driver.get('http://127.0.0.1:5000/game/test')
        self.driver.implicitly_wait(5)
        #Confirm scorecards match expected scorecards given the set seed
        scorecard1 = self.driver.find_element_by_id('scoreCard1').text
        scorecard2 = self.driver.find_element_by_id('scoreCard2').text
        scorecard3 = self.driver.find_element_by_id('scoreCard3').text
        scorecard4 = self.driver.find_element_by_id('scoreCard4').text
        self.assertEqual(scorecard1, "Wildholds")
        self.assertEqual(scorecard2, "Faunlost Thicket")
        self.assertEqual(scorecard3, "Mages Valley")
        self.assertEqual(scorecard4, "Borderlands")
        leftButton = self.driver.find_element_by_id('leftButton')
        rightButton = self.driver.find_element_by_id('rightButton')
        upButton = self.driver.find_element_by_id('upButton')
        downButton = self.driver.find_element_by_id('downButton')
        rotateButton = self.driver.find_element_by_id('rotateButton')
        flipButton = self.driver.find_element_by_id('flipButton')
        swapButton = self.driver.find_element_by_id('swapButton')
        placeButton = self.driver.find_element_by_id('placeButton')
        #Confirm this season has 4 cards
        cards = self.driver.find_element_by_id('cardsRemaining1').text
        self.assertEqual(cards, "Cards remaining: 4")
        #Season 1 - Piece 1
        rotateButton.click()
        leftButton.click()
        upButton.click()
        placeButton.click()
        #Season 1 - Piece 2
        flipButton.click()
        leftButton.click()
        leftButton.click()
        leftButton.click()
        upButton.click()
        upButton.click()
        placeButton.click()
        #One of the mountains has been fully surrounded so there should be a claimed mountain on the gameboard
        claimedMountains = len(self.driver.find_elements_by_name('claimed_mountain'))
        self.assertTrue(claimedMountains == 1)
        #Claiming the mountain should have granted the player a coin
        coins = self.driver.find_element_by_id('playerCoins').text
        self.assertEqual(coins, "Coins: 1")
        #Season 1 - Piece 3
        swapButton.click()
        downButton.click()
        placeButton.click()
        #This piece should have granted us a coin since we swapped it's type (and it's alt property was 'shape')
        coins = self.driver.find_element_by_id('playerCoins').text
        self.assertEqual(coins, "Coins: 2")
        #Season 1 - Piece 4
        swapButton.click()
        downButton.click()
        downButton.click()
        leftButton.click()
        leftButton.click()
        placeButton.click()
        #We should have scored 8 points from the Wildholds scorecard and 2 points from our coins
        points = self.driver.find_element_by_id('playerPoints').text
        self.assertEqual(points, "Points: 10")
        #Confirm this season has 5 cards
        cards = self.driver.find_element_by_id('cardsRemaining2').text
        self.assertEqual(cards, "Cards remaining: 5")
        #Season 2 - Piece 1
        #Attempt to place the piece in an illegal position 
        placeButton.click()
        #Confirm the piece was not placed and there are still 5 cards remaining this season
        cards = self.driver.find_element_by_id('cardsRemaining2').text
        self.assertEqual(cards, "Cards remaining: 5")
        rightButton.click()
        rightButton.click()
        placeButton.click()
        #Season 2 - Piece 2
        #Attempt to move the piece off the bottom of the board
        downButton.click()
        downButton.click()
        downButton.click()
        downButton.click()
        downButton.click()
        downButton.click()
        #Verify that the piece (which is the only farm square) is still located on the board
        farms = len(self.driver.find_elements_by_name('farm'))
        self.assertTrue(farms == 1)
        placeButton.click()
        #Season 2 - Piece 3
        downButton.click()
        downButton.click()
        leftButton.click()
        leftButton.click()
        leftButton.click()
        placeButton.click()
        #Season 2 - Piece 4
        upButton.click()
        upButton.click()
        upButton.click()
        rightButton.click()
        placeButton.click()
        #Season 2 - Piece 5
        rightButton.click()
        rightButton.click()
        rightButton.click()
        upButton.click()
        upButton.click()
        upButton.click()
        upButton.click()
        #Attempt to rotate the piece off of the board (since this piece is a long line with the pivot at one end)
        rotateButton.click()
        rotateButton.click()
        #Verify that the piece has been translated back onto the board until it is entirely on the board
        rivers = len(self.driver.find_elements_by_name('river'))
        self.assertTrue(rivers == 12)
        placeButton.click()
        #We should have scored 6 points from the Faunlost Thicket scorecard and 2 points from our coins
        points = self.driver.find_element_by_id('playerPoints').text
        self.assertEqual(points, "Points: 18")
        #Confirm this season has 3 cards
        cards = self.driver.find_element_by_id('cardsRemaining3').text
        self.assertEqual(cards, "Cards remaining: 3")
        #Season 3 - Piece 1
        #Attempt to place the piece (twice) in an illegal position 
        placeButton.click()
        placeButton.click()
        #Confirm the piece was not placed and there are still 3 cards remaining this season
        cards = self.driver.find_element_by_id('cardsRemaining3').text
        self.assertEqual(cards, "Cards remaining: 3")
        rotateButton.click()
        downButton.click()
        downButton.click()
        downButton.click()
        rightButton.click()
        rightButton.click()
        swapButton.click()
        placeButton.click()
        #This piece should have granted us a coin since we swapped it's type (and it's alt property was 'shape')
        coins = self.driver.find_element_by_id('playerCoins').text
        self.assertEqual(coins, "Coins: 3")
        #Season 3 - Piece 2
        rightButton.click()
        rightButton.click()
        upButton.click()
        upButton.click()
        placeButton.click()
        #The second mountain has been fully surrounded so there should be 2 claimed mountains on the gameboard
        claimedMountains = len(self.driver.find_elements_by_name('claimed_mountain'))
        self.assertTrue(claimedMountains == 2)
        #Claiming the mountain should have granted the player a coin
        coins = self.driver.find_element_by_id('playerCoins').text
        self.assertEqual(coins, "Coins: 4")
        #Season 3 - Piece 3
        #Attempt to move the piece off the left-side of the board
        rotateButton.click()
        leftButton.click()
        leftButton.click()
        leftButton.click()
        leftButton.click()
        leftButton.click()
        leftButton.click()
        leftButton.click()
        leftButton.click()
        leftButton.click()
        #Verify that the piece is still located on the board
        forests = len(self.driver.find_elements_by_name('forest'))
        self.assertTrue(forests == 15)
        placeButton.click()
        #We should have scored 6 points from the Mages Valley scorecard, 12 points from the Borderlands scorecard, and 4 points from our coins
        points = self.driver.find_element_by_id('playerPoints').text
        self.assertEqual(points, "Points: 40")
        #Confirm that the game over modal has appeared with a button to start a new freeplay game. Confirm the button works
        freeplayGameButton = self.driver.find_element_by_link_text('Start New Freeplay Game!')
        freeplayGameButton.click()
        self.driver.implicitly_wait(5)
        #Confirm we have been redirected to freeplay game
        self.assertEqual(self.driver.current_url, "http://127.0.0.1:5000/game/freeplay")
        return
    
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

    #Test that the leaderboard page shows scores from all users in the database
    def test_leaderboardPage(self):
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
        #Navigate to leaderboard page
        self.driver.get('http://127.0.0.1:5000/leaderboard')
        self.driver.implicitly_wait(5)
        #Check daily scores and this user's highest daily attempt. Only use first 25 characters because next characters are the date (which will vary)
        daily_highestScore = self.driver.find_elements_by_name('dailyScore')[0].text[0:25]
        daily_scoreCount = len(self.driver.find_elements_by_name('dailyScore'))
        daily_myHighestAttempt = self.driver.find_element_by_id('leaderboard_dailyHighscore').text[0:25]
        self.assertEqual(daily_highestScore, "test3 scored 40 points on")
        self.assertEqual(daily_scoreCount, 9)
        self.assertEqual(daily_myHighestAttempt, "test1 scored 15 points on")
        #Click on the freeplay tab to display the leaderboard's freeplay scores
        freeplay_tab = self.driver.find_element_by_id('freeplay-tab')
        freeplay_tab.click()
        self.driver.implicitly_wait(5)
        #Check freeplay scores and this user's highest freeplay attempt. Only use first 25 characters because next characters are the date (which will vary)
        freeplay_highestScore = self.driver.find_elements_by_name('freeplayScore')[0].text[0:25]
        freeplay_scoreCount = len(self.driver.find_elements_by_name('freeplayScore'))
        freeplay_myHighestAttempt = self.driver.find_element_by_id('leaderboard_freeplayHighscore').text[0:25]
        self.assertEqual(freeplay_highestScore, "test3 scored 50 points on")
        self.assertEqual(freeplay_scoreCount, 9)
        self.assertEqual(freeplay_myHighestAttempt, "test1 scored 30 points on")
        return

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

    #Test that the profile page shows scores and aggregate results for the signed in user
    def test_profilePage(self):
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
        #Check overall total and average are correct
        overall_total = self.driver.find_element_by_id('profile_overallTotal').text
        overall_avg = self.driver.find_element_by_id('profile_overallAvg').text
        self.assertEqual(overall_total, "Total number of games played: 6")
        self.assertEqual(overall_avg, "Your average points: 17.50")
        #Check daily total, average, highscore, and score count
        daily_total = self.driver.find_element_by_id('profile_dailyTotal').text
        daily_avg = self.driver.find_element_by_id('profile_dailyAvg').text
        #Only use first 25 characters because next characters are the date (which will vary)
        daily_highscore = self.driver.find_element_by_id('profile_dailyHighscore').text[0:25]
        daily_scoreCount = len(self.driver.find_elements_by_name('dailyScore'))
        self.assertEqual(daily_total, "Total number of dailies completed: 3")
        self.assertEqual(daily_avg, "Your daily average points: 10.00")
        self.assertEqual(daily_highscore, "test1 scored 15 points on")
        self.assertEqual(daily_scoreCount, 3)
        #Click on the freeplay tab to display the user's freeplay scores
        freeplay_tab = self.driver.find_element_by_id('freeplay-tab')
        freeplay_tab.click()
        self.driver.implicitly_wait(5)
        #Check freeplay total, average, highscore, and score count
        freeplay_total = self.driver.find_element_by_id('profile_freeplayTotal').text
        freeplay_avg = self.driver.find_element_by_id('profile_freeplayAvg').text
        #Only use first 25 characters because next characters are the date (which will vary)
        freeplay_highscore = self.driver.find_element_by_id('profile_freeplayHighscore').text[0:25]
        freeplay_scoreCount = len(self.driver.find_elements_by_name('freeplayScore'))
        self.assertEqual(freeplay_total, "Total number of freeplay games played: 3")
        self.assertEqual(freeplay_avg, "Your freeplay average points: 25.00")
        self.assertEqual(freeplay_highscore, "test1 scored 30 points on")
        self.assertEqual(freeplay_scoreCount, 3)
        return

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

if __name__=='__main__':
    unittest.main(verbosity=2)