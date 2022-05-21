from flask import render_template
from app import app, db
from flask_login import current_user, login_user, logout_user, login_required
from models import User, Scorelist, Scorecard

@app.errorhandler(404)
def not_found_error(error):
    return render_template('404_error.html', user=current_user), 404

@app.errorhandler(500)
def internal_error(error):
    db.session.rollback()
    return render_template('500_error.html', user=current_user), 500