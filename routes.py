from app import app, db
from flask import request, render_template, flash, redirect,url_for
from flask_login import current_user, login_user, logout_user, login_required
from models import User, Scorelist, Scorecard
from werkzeug.urls import url_parse
from forms import RegistrationForm, LoginForm
from datetime import datetime
from sqlalchemy import func

#Route for the main page
@app.route("/")
def main_page():
    return render_template("index.html", user=current_user)

#Route for the gamne page, takes type (daily or freeplay) as an argument
#Login is required to visit the game page 
@app.route("/game/<type>", methods=['GET', 'POST'])
@login_required
def game(type):
    #Renders the game page for the user
    if request.method == 'GET':
        return render_template("game_page.html", user=current_user)
    #Scores are posted once the game ends, uses the argument <type> to determine what type of scorecard is created
    if request.method == 'POST':
        output = int(request.get_json())
        user = current_user
        if type == 'daily':
            new_scorecard = Scorecard(score=output, uname=user.username, scorelist_id=user.scorelists.id, type=1)
            db.session.add(new_scorecard)
            db.session.commit()
        elif type == 'freeplay':
            new_scorecard = Scorecard(score=output, uname=user.username, scorelist_id=user.scorelists.id, type=2)
            db.session.add(new_scorecard)
            db.session.commit()

#Route for the rules page
@app.route("/rules")
def rules():
    return render_template("rules_page.html", user=current_user)

#Route for the credits page
@app.route("/credits")
def credits():
    return render_template("credits_page.html", user=current_user)

#Route for the profile page, login is required to access this page
#Uses the current_user to display related statistics associated with that user 
@app.route('/user/<username>', methods=['GET', 'POST'])
@login_required
def user(username):
    user = current_user
    #Calculates the average score of a user, with checks to ensure that the page doesn't crash if their average is 0
    total_avg = Scorecard.query.with_entities(func.avg(Scorecard.score)).filter(Scorecard.uname == user.username).all()[0][0]
    if total_avg == None:
        total_avg = 0.00
    total_avg = "{:.2f}".format(total_avg)
    #Calculates the average freeplay score of a user, with checks to ensure that the page doesn't crash if their average is 0
    freeplay_avg = Scorecard.query.with_entities(func.avg(Scorecard.score)).filter(Scorecard.uname == user.username).filter(Scorecard.type == 2).all()[0][0]
    if freeplay_avg == None:
        freeplay_avg = 0.00
    freeplay_avg = "{:.2f}".format(freeplay_avg)
    daily_avg = Scorecard.query.with_entities(func.avg(Scorecard.score)).filter(Scorecard.uname == user.username).filter(Scorecard.type == 1).all()[0][0]
    #Calculates the average daily score of a user, with checks to ensure that the page doesn't crash if their average is 0
    if daily_avg == None:
        daily_avg = 0.00
    daily_avg = "{:.2f}".format(daily_avg)
    return render_template('profile_page.html', user=user, total_avg=total_avg, freeplay_avg=freeplay_avg, daily_avg=daily_avg)

#Route for the leaderboard page, login is required to access this page
@app.route('/leaderboard')
@login_required
def leaderboard():
    user = current_user
    #Database query to return the top 10 scores of all time for freeplay mode
    scores_freeplay = Scorecard.query.filter(Scorecard.type == 2).order_by(Scorecard.score.desc()).limit(10)
    freeplay_highscore = Scorecard.query.filter(Scorecard.type == 2).filter(Scorecard.uname == user.username).order_by(Scorecard.score.desc()).first()
    #Databse query to return the top 10 freeplay scores of the current date
    scores_daily = Scorecard.query.filter(Scorecard.type == 1).filter(Scorecard.date == datetime.now().date()).order_by(Scorecard.score.desc()).limit(10)
    daily_highscore = Scorecard.query.filter(Scorecard.type == 1).filter(Scorecard.date == datetime.now().date()).filter(Scorecard.uname == user.username).order_by(Scorecard.score.desc()).first()
    #Calculates the average scores for freeplay and daily modes, with checks to ensure that the page doesn't crash if their average is 0
    daily_avg = Scorecard.query.with_entities(func.avg(Scorecard.score)).filter(Scorecard.type == 1).filter(Scorecard.date == datetime.now().date()).all()[0][0]
    if daily_avg == None:
        daily_avg = 0.00
    daily_avg = "{:.2f}".format(daily_avg)
    freeplay_avg = Scorecard.query.with_entities(func.avg(Scorecard.score)).filter(Scorecard.type == 2).all()[0][0]
    if freeplay_avg == None:
        freeplay_avg = 0.00
    freeplay_avg = "{:.2f}".format(freeplay_avg)
    return render_template('leaderboard_page.html', user=user, daily_avg=daily_avg, freeplay_avg=freeplay_avg, score_freeplay=scores_freeplay, score_daily=scores_daily, freeplay_highscore=freeplay_highscore, daiy_highscore=daily_highscore)

#Route to allow users to view scores of a selected date
@app.route('/update_daily', methods = ['POST'])
def update_daily():
    user = current_user
    #User input data from form
    date_string = request.get_json()
    daily_highscore = Scorecard.query.filter(Scorecard.type == 1).filter(Scorecard.date == datetime.fromisoformat(date_string).date()).filter(Scorecard.uname == user.username).order_by(Scorecard.score.desc()).first()
    scores_daily = Scorecard.query.filter(Scorecard.type == 1).filter(Scorecard.date == datetime.fromisoformat(date_string).date()).order_by(Scorecard.score.desc()).limit(10)
    daily_avg = Scorecard.query.with_entities(func.avg(Scorecard.score)).filter(Scorecard.type == 1).filter(Scorecard.date == datetime.fromisoformat(date_string).date()).all()[0][0]
    if daily_avg == None:
        daily_avg = 0.00
    daily_avg = "{:.2f}".format(daily_avg)
    return render_template('leaderboard_daily.html', daily_avg=daily_avg, score_daily=scores_daily, daily_highscore=daily_highscore)

#Route for the registration page
@app.route('/register', methods=['GET', 'POST'])
def register():
    #If the user is already logged in, redirect them to the main page
    if current_user.is_authenticated:
        return redirect(url_for('main_page'))
    form = RegistrationForm()
    #Validate the form from the user and register them
    if form.validate_on_submit():
        user1 = User(username=form.username.data, email=form.email.data)
        user1.set_password(form.password.data)
        db.session.add(user1)
        db.session.commit()
        scorelist1 = Scorelist(user_id = user1.id)
        db.session.add(scorelist1)
        db.session.commit()
        flash('Congratulations, you are now a registered user!')
        return redirect(url_for('login'))
    return render_template('register_page.html', title='Register', form=form, user=current_user)

#Route for the login page
@app.route('/login', methods=['GET', 'POST'])
def login():
    #If the user is already logged in, redirect them to the main page
    if current_user.is_authenticated:
        return redirect(url_for('main_page'))
    form = LoginForm()
    #Validate the form from the user and log them in
    if form.validate_on_submit():
        user = User.query.filter_by(username=form.username.data).first()
        #If user does not exist or parameters are invalid, return to the login page
        if user is None or not user.check_password(form.password.data):
            flash('Invalid username or password')
            return redirect(url_for('login'))
        login_user(user, remember=form.remember_me.data)
        #If the user is successfully, logged in, return to the main page
        return redirect(url_for('main_page'))
    return render_template('login_page.html', title='Sign In', form=form, user=current_user)

#Route to log a user out
@app.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('login'))

#Route to get server date for use in producing daily seeds 
@app.route('/get_date', methods=['GET'])
@login_required
def get_date():
    currentDate = datetime.now()
    return currentDate.strftime("%Y-%m-%d")
