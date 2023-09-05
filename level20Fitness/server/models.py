from sqlalchemy.dialects.postgresql import JSON
from flask import Flask
from flask_login import UserMixin
from flask_sqlalchemy import SQLAlchemy
import os

app = Flask(__name__)
app.config.from_object(os.environ['APP_SETTINGS'])
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

class User(db.Model, UserMixin):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(), unique=True)
    email = db.Column(db.String(), unique=True)
    password = db.Column(db.String())
    workouts = db.relationship('Workout', backref='User', lazy='dynamic')

    def __init__(self, username, email, password):
        self.username = username
        self.email = email
        self.password = password

    def __repr__(self):
        return f'<id {self.id}>'

class Workout(db.Model):
    __tablename__ = 'workouts'

    id = db.Column(db.Integer, primary_key=True)
    muscle_group = db.Column(db.String())
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    user = db.relationship('User')
    skill_measures = db.relationship('SkillMeasure', backref='Workout', lazy='dynamic')

    def __init__(self, muscle_group, user):
        self.muscle_group = muscle_group
        self.user = user
        self.user_id = user.id
    
    def __repr__(self):
        return f'<id {self.id}>'
    

class SkillMeasure(db.Model):
    __tablename__ = 'skillmeasures'

    id = db.Column(db.Integer, primary_key=True)
    exercise = db.Column(db.String())
    reps_or_weight = db.Column(db.String())
    original = db.Column(db.Integer) 
    current = db.Column(db.Integer)
    target = db.Column(db.Integer)
    workout_id = db.Column(db.Integer, db.ForeignKey('workouts.id'))
    workout = db.relationship('Workout')

    def __init__(self, exercise, reps_or_weight, current, target, workout, original):
        self.exercise = exercise
        self.reps_or_weight = reps_or_weight
        self.current = current
        self.target = target
        self.workout = workout
        self.original = original
    
    def __repr__(self):
        return f'<id {self.id}>'