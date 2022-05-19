# CITS3403_Cartographers
CITS3403 Project - Josh Wyatt (@jwyatt1999, 22601159) &amp; Joo Kai Tay (@Bsubs, 22489437)

## Link to Deployed Website
https://afternoon-castle-17520.herokuapp.com/

## Purpose and Design of the Application

**Purpose**

The purpose of the application is to provide a daily puzzle that challenges users to think and plan strategically.

Users are encouraged to achieve the highest score they can to place on the leaderboard, which all registered users can see.

**Design**

The game component of the application was based on the board game "Cartographers: A Roll Player Tale", with some simplifications. 

The architecture was designed to be as shallow as possible so that it is easy to navigate from one page to any other page in just a few button clicks.

## Architecture of the Application

- The website has a central home page. From this page:
 - Users that are not logged in can access the credits, login, and rules pages
 - Users that are logged in can access the credits, game, leaderboard, profile, and rules pages, and the logout button
- There is a navbar that is present on all pages:
 - Users that are not logged in can use this to access the credits, home, login, and rules pages
 - Users that are logged in can use this to access the credits, home, leaderboard, profile, and rules pages, and the logout button
- The login page can be used to access the registration page
- The credits, game, leaderboard, profile, and rules pages only have access to other pages via the navbar

**Summary of required pages**
- The rules page is responsible for promoting the theme and purpose to the users, and explaining the rules.
- The game page is responsible for presenting the game and has two modes: freeplay and daily.
- The leaderboard page shows aggregate results from all users.
- The profile page shows aggregate results and usage statistics for the logged in user.

## How to Launch the Application Locally

**If virtual environment has NOT been set up for the project**

1. Open your preferred command line tool and navigate to the base project folder
2. Enter the command `python -m venv venv` to create a new virtual environment
3. Enter the comamnd `python venv\Scripts\activate` to activate the virtual environment
4. Enter the command `pip install -r requirements.txt` to install the website's requirements
5. Enter the command `python -m flask run` to run the application locally

**If virtual environment has been set up for the project**

1. Open your preferred command line tool and navigate to the base project folder
2. Enter the command `python -m flask run` to run the application locally

**The application will be run on your localhost: http://127.0.0.1:5000/**

## Unit Tests and How to Run Them

**Database tests**

- Information
 - Code is located in test.py
 - These tests do not need the website to be running locally to pass
 - Primarily uses the unittester module for testing
- Test cases
 - Test password hashing
 - Test adding scorelist to user in database
 - Test adding scorecard to user's scorelist in database

**System tests**

- Information
 - These are located in systemtest.py
 - These tests DO need the website to be running locally to pass
 - Primarily uses the selenium webdriver module for testing
 - The tests expect chromedriver.exe v101.0.4951.41 to be located in the base project folder
- Test cases
 - Test that the various game functions work as expected
 - Test that the random initial gameboard has the correct features 
 - Test that the leaderboard page shows scores from all users in the database
 - Test that the login and logout functionality works as expected
 - Test that the profile page shows scores and aggregate results for the signed in user
 - Test that registration functionality works as expected

### How to run tests (Assuming virtual environment has been set up for the project)

**Database tests**

1. Open your preferred command line tool and navigate to the base project folder
2. Enter the command `python -W ignore -m test` to run the tests

**System tests**

1. Go to https://chromedriver.chromium.org/downloads and download ChromeDriver 101.0.4951.41
2. Extract chromedriver.exe from the zip file and place it into the base project folder
3. Open your preferred command line tool and navigate to the base project folder
4. Enter the command `python -m flask run` to run the website locally
5. Open a new window of your preferred command line tool and navigate to the base project folder
6. In the new window, enter the command `python -W ignore -m systemtest` to run the tests

## Agile Development of the Application

**Sprint 0: Weeks 2 to 4 (07/03 - 27/03)**

- Plan website design and produce mock-ups
 - Design research: https://docs.google.com/document/d/1QrGW9SO62FUvuBtXbQnhL7UxGan68RmVWrHDDjv6CFE/edit?usp=sharing
 - Mock-ups: https://docs.google.com/document/d/1zg2zjm-CSWDYzQOq5uddbx25X5SDjSpgAvXawfRdiZA/edit?usp=sharing
- Get barebones prototype of the game that can be run locally
 - Prototype design: https://docs.google.com/document/d/155k1VanFCSsB78VyaC0BJStdflELVEW_yfY04m7-SEA/edit?usp=sharing 

**Sprint 1: Weeks 5 to 7 (28/03 - 17/04)**

- Implement account creation, login and logout functionality, and score storing
- Implement majority of website pages
- Iterate upon game prototype to include all planned features

**Sprint 1 Retrospective and Sprint 2 Kick-Off Notes**

- https://docs.google.com/document/d/1RUKDAd9BfHIhNcFmOqSdoINlhxawhGFtcPW6xkHBycw/edit?usp=sharing

**Sprint 2: Weeks 8 to 10 (18/04 - 08/05)**

- Deploy website to Heroku
- Implement profile and leaderboard pages
- Get game into playtesting
- Improve website's rendering on mobile

**Sprint 2 Retrospective and Sprint 3 Kick-Off Notes**

- https://docs.google.com/document/d/1MSLXoXMzvl6Qz383UGGa_419USWzmgMK3BLdQko4w4I/edit?usp=sharing

**Sprint 3: Weeks 11 to 12 (09/05 - 22/05)**

- Implement database and system tests
- Implement score sharing on social media
- Implement best suggestions from playtesters

**Project Due: Week 13 (23/05 12pm)**

## References

- Cartographers (board game) rules: https://www.thunderworksgames.com/uploads/1/1/6/3/11638029/cartographers_rulebook_website.pdf