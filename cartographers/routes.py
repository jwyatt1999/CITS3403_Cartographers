import app
from flask import request, render_template, flash, redirect,url_for
from flask_login import current_user, login_user, logout_user, login_required
from models import User, Scorelist, Scorecard
from werkzeug.urls import url_parse
from forms import RegistrationForm, LoginForm
from datetime import datetime

@app.route("/")
def main_page():
    return render_template("index.html", user=current_user)

@app.route("/game")
@login_required
def game():
    return render_template("game_page.html", user=current_user)

@app.route("/rules")
def rules():
    return render_template("rules_page.html", user=current_user)

@app.route("/info")
def information():
    return render_template("information_page.html", user=current_user)

@app.route('/user/<username>',methods=['GET', 'POST'])
@login_required
def user(username):
    user = current_user
    return render_template('profile_page.html', user=user)

@app.route('/leaderboard',methods=['GET', 'POST'])
def leaderboard():
    scores_global = Scorecard.query.order_by(Scorecard.score.desc())
    return render_template('leaderboard_page.html', user=current_user, score_global=scores_global)

@app.route('/register', methods=['GET', 'POST'])
def register():
    if current_user.is_authenticated:
        return redirect(url_for('game'))
    form = RegistrationForm()
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

@app.route('/login', methods=['GET', 'POST'])
def login():
    if current_user.is_authenticated:
        return redirect(url_for('game'))
    form = LoginForm()
    if form.validate_on_submit():
        user = User.query.filter_by(username=form.username.data).first()
        if user is None or not user.check_password(form.password.data):
            flash('Invalid username or password')
            return redirect(url_for('login'))
        login_user(user, remember=form.remember_me.data)
        next_page = request.args.get('next')
        if not next_page or url_parse(next_page).netloc != '':
            next_page = url_for('user', username = form.username.data, user=current_user)
        return redirect(next_page)
    return render_template('login_page.html', title='Sign In', form=form, user=current_user)

@app.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('login'))

#Listens for final score when user completes a game and passes it into the database
@app.route('/add_score', methods=['POST'])
@login_required
def add_score():
    output = int(request.get_json())
    user = current_user
    new_scorecard = Scorecard(score=output, uname=user.username, scorelist_id=user.scorelist_freeplay.id)
    db.session.add(new_scorecard)
    db.session.commit()
    return ""

@app.route('/get_date', methods=['GET'])
@login_required
def get_date():
    currentDate = datetime.now()
    return currentDate.strftime("%d/%m/%Y")
