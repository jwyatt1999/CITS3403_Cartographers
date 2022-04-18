from app import db
from models import User

user = User(username='JooKai', email='tayjookai@gmail.com')
user.set_password('Password1')
db.session.add(user)
db.session.commit()