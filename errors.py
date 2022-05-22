from flask import render_template
from app import app, db
from flask_login import current_user, login_user, logout_user, login_required
from models import User, Scorelist, Scorecard

#Route to handle 404 page not found errors with custom HTML templates instead of the default crash page
@app.errorhandler(404)
def not_found_error(error):
    return render_template('404_error.html', user=current_user), 404

#Route to handle 500 internal server errors with custom HTML templates instead of the default crash page
@app.errorhandler(500)
def internal_error(error):
    db.session.rollback()
    return render_template('500_error.html', user=current_user), 500