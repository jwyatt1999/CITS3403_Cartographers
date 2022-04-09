from app import app, db
from flask import request, render_template, flash, redirect,url_for
from flask_login import current_user, login_user, logout_user, login_required
from models import User
from werkzeug.urls import url_parse
from forms import RegistrationForm, LoginForm

@app.route("/")
def main_page():
    return render_template("index.html")

@app.route("/game")
def game():
    return render_template("game_page.html")

@app.route("/rules")
def rules():
    return render_template("rules.html")

@app.route("/info")
def information():
    return render_template("info.html")

@app.route('/user/<username>',methods=['GET', 'POST'])
@login_required
def user(username):
	user = current_user
	user = User.query.filter_by(username=user.username).first()
	return render_template('user.html', user=user)

@app.route('/register', methods=['GET', 'POST'])
def register():
    if current_user.is_authenticated:
        return redirect(url_for('game'))
    form = RegistrationForm()
    if form.validate_on_submit():
        user = User(username=form.username.data, email=form.email.data)
        user.set_password(form.password.data)
        db.session.add(user)
        db.session.commit()
        flash('Congratulations, you are now a registered user!')
        return redirect(url_for('login'))
    return render_template('register_page.html', title='Register', form=form)

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
            next_page = url_for('user', username = form.username.data)
        return redirect(next_page)
    return render_template('login_page.html', title='Sign In', form=form)

@app.route('/logout')
def logout():
    logout_user()
    return redirect(url_for('login'))