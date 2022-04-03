from distutils.log import info
from flask import Flask, render_template, request
from flask_wtf import FlaskForm
from wtforms import StringField, SubmitField

app = Flask(__name__)
app.config['SECRET_KEY'] = 'mysecret'

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