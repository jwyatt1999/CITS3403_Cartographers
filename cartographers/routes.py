from app import app, db
from flask import request, render_template, flash, redirect,url_for
from flask_login import current_user, login_user, logout_user, login_required
from models import User, Scorelist, Scorecard
from werkzeug.urls import url_parse
from forms import RegistrationForm, LoginForm

@app.route("/")
def main_page():
    return render_template("index.html", user=current_user)

@app.route("/game/<type>", methods=['GET', 'POST']) 
@login_required
def game(type):
    if request.method == 'GET':
        return render_template("game_page.html", user=current_user)
    
    if request.method == 'POST':
        output = int(request.get_json())
        user = current_user
        if type == 'daily':
            new_scorecard = Scorecard(score=output, uname=user.username, scorelist_id=user.scorelists.id, type = 1)
            db.session.add(new_scorecard)
            db.session.commit()
            return ""
        elif type == 'freeplay':
            new_scorecard = Scorecard(score=output, uname=user.username, scorelist_id=user.scorelists.id, type = 2)
            db.session.add(new_scorecard)
            db.session.commit()
            return ""

@app.route("/rules")
def rules():
    return render_template("rules_page.html", user=current_user)

@app.route("/information")
def information():
    return render_template("information_page.html", user=current_user)

@app.route('/user/<username>',methods=['GET', 'POST'])
@login_required
def user(username):
    user = current_user
    return render_template('profile_page.html', user=user)

@app.route('/leaderboard')
def leaderboard():
    scores_daily = Scorecard.query.filter(Scorecard.type == 1).order_by(Scorecard.score.desc())
    scores_freeplay = Scorecard.query.filter(Scorecard.type == 2).order_by(Scorecard.score.desc())
    return render_template('leaderboard_page.html', user=current_user, score_freeplay = scores_freeplay, score_daily = scores_daily)

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
        return redirect(url_for('main_page'))
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
