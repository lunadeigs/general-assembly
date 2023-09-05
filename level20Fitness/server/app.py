from flask import Flask, jsonify, request, session
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import generate_password_hash, check_password_hash
from flask_login import login_user, current_user, LoginManager, login_required, logout_user
import os
from models import User, app, db, Workout, SkillMeasure
import psycopg2

login_manager = LoginManager()
login_manager.login_view = 'auth.login'
login_manager.login_message = 'Please Log in to view this page'

app.config['SECRET_KEY'] = 'NEEDS TO BE CHANGED'

login_manager.init_app(app)

conn = psycopg2.connect(
    database='level20fitness',
    user='postgres',
    password='1211',
    host='127.0.0.1',
    port='5432'
)

cursor = conn.cursor()

PORT = 8000

def split(word):
    return [char for char in word]

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

# Helper Methods

def jsonifyWorkout(workout):
    workoutSerialized = {}
    workoutSerialized['id'] = workout.id
    workoutSerialized['muscleGroup'] = workout.muscle_group
    workoutSerialized['user'] = workout.user.username
    workoutSerialized['skillMeasures'] = []
    i = 0
    for j in workout.skill_measures:
        workoutSerialized['skillMeasures'].append({})
        workoutSerialized['skillMeasures'][i]['id'] = j.id
        workoutSerialized['skillMeasures'][i]['exercise'] = j.exercise
        workoutSerialized['skillMeasures'][i]['repsOrWeight'] = j.reps_or_weight
        workoutSerialized['skillMeasures'][i]['original'] = j.original
        workoutSerialized['skillMeasures'][i]['current'] = j.current
        workoutSerialized['skillMeasures'][i]['target'] = j.target
        i += 1
    return workoutSerialized

# USER ROUTES:
@app.route('/registerUser', methods=['POST'])
def registerUser():
    try:
        payload = request.get_json()
        email = payload['email']
        username = payload['username']
        cursor.execute(f"""SELECT * FROM users WHERE email='{email}'""")
        users_with_copy = cursor.fetchall()
        if(len(users_with_copy) > 0):
            return jsonify(data={}, status={'status': 401, 'message': 'User with that email already exists'})
        
        cursor.execute(f"""SELECT * FROM users WHERE username='{username}'""")
        users_with_copy = cursor.fetchall()
        if(len(users_with_copy) > 0):
            return jsonify(data={}, status={'status': 401, 'message': 'User with that username already exists'})
        
        payload['password'] = generate_password_hash(payload['password'].encode('utf-8')).decode('utf-8')
        print(payload['password'])
        user = User(
            username = payload['username'],
            email = payload['email'].lower(),
            password = payload['password'],
        )
        db.session.add(user)
        db.session.commit()
        return jsonify(data={
            "username": payload["username"],
            "email": payload["email"]
        }, status={'code': 201, 'message': 'success'})
    except Exception as err:
        print(err)
        return jsonify(data={}, status={'status': 401, 'message': 'Something went wrong uploading User'})

@app.route('/getUsers', methods=['GET'])
def getUsers():
    cursor.execute("SELECT * FROM users")
    user_list = cursor.fetchall()
    return jsonify({"data": user_list}, {"status": "201", "message": "Success"})

@app.route('/getUser/<id>', methods=['GET'])
def getUser(id):
    cursor.execute(f"SELECT * FROM users WHERE id = {id}")
    user = cursor.fetchall()
    if(len(user) == 0):
        return jsonify(data={}, status={"status": 400, "message": "User Does Not Exist"})
    user = user[0]
    return jsonify(data= {
        "id": user[0],
        "username": user[1],
        "email": user[2]
    }, status={"status": 200, "message": "Success"})

@app.route('/deleteUser/<id>', methods=['DELETE'])
@login_required
def deleteUser(id):
    cursor.execute(f"SELECT * FROM users WHERE id = {id}")
    user = cursor.fetchall()
    if(len(user) == 0):
        return jsonify(data={}, status={"status": 400, "message": "User Does Not Exist"})
    user = User.query.get_or_404(id)
    logout_user()
    db.session.delete(user)
    db.session.commit()
    return jsonify(data={}, status={'status': 200, 'message': 'Success'})

@app.route('/updateUser/<id>', methods=['PUT'])
@login_required
def updateUser(id):
    payload = request.get_json()
    cursor.execute(f"SELECT * FROM users WHERE id = {id}")
    user = cursor.fetchall()
    if(len(user) == 0):
        return jsonify(data={}, status={"status": 400, "message": "User Does Not Exist"})
    user = User.query.get_or_404(id)
    payload['password'] = generate_password_hash(payload['password'].encode('utf-8'))
    user.username = payload['username']
    user.email = payload['email']
    user.password = payload['password']
    db.session.add(user)
    db.session.commit()
    print(user.username)
    return jsonify(body={
        "username": user.username,
        "email": user.email,
        "id": user.id
    }, status={'status': 200, 'message': 'User Updated'})

@app.route('/login', methods=['POST'])
def login():
    payload = request.get_json()
    cursor.execute(f"SELECT * FROM users WHERE username = '{payload['username']}'")
    user = cursor.fetchall()
    if(len(user) == 0):
        return jsonify(data={}, status={'code': 401, 'message': 'Username or Password is incorrect'})
    user = user[0]
    print(user)
    if(check_password_hash(user[3].encode('ascii'), payload['password'])):
        user = User.query.get_or_404(user[0])
        login_user(user)
        return jsonify(data={}, status={'code': 200, 'message': 'Success'})
    else:
        return jsonify(data={}, status={'code': 401, 'message': 'Username or Password is incorrect'})

@app.route('/logout', methods=['GET'])
@login_required
def logout():
    current_user = User.query.get_or_404(session['_user_id'])
    if(current_user == None):
        return jsonify(data={}, status={'code': 400, 'message': 'No User Logged In'})
    logout_user()
    return jsonify(data={}, status={'code': 200, 'message': 'Successful Logout'})

@app.route('/getCurrentUser', methods=['GET'])
@login_required
def getCurrentUser():
    current_user = User.query.get_or_404(session['_user_id'])
    return jsonify(data = {'username': current_user.username}, status={'code': 200, 'message': 'Success'})

# WORKOUT ROUTES

@app.route('/createWorkout', methods=['POST'])
@login_required
def createWorkout():
    current_user = User.query.get_or_404(session['_user_id'])
    payload = request.get_json()
    workout = Workout(
        muscle_group = payload['muscleGroup'],
        user = current_user
    )
    db.session.add(workout)
    db.session.commit()

    current_workout = Workout.query.get_or_404(workout.id)

    for skill_measure in payload['skillMeasures']:
        skill = SkillMeasure(
            exercise = skill_measure['exercise'],
            reps_or_weight = skill_measure['repsOrWeight'],
            current = skill_measure['current'],
            target = skill_measure['target'],
            workout = current_workout,
            original = skill_measure['current']
        )    
        db.session.add(skill)
        db.session.commit()
    
    
    
    return jsonify(data={'muscleGroup': payload['muscleGroup'], "username": current_user.username, "skillMeasures": payload['skillMeasures']}, status={'code': 200, 'message': 'Successful Workout Creation'})

@app.route('/getWorkouts', methods=['GET'])
@login_required
def getWorkouts():
    workouts = Workout.query.filter(Workout.user_id == session['_user_id']).all()
    i = 0
    workoutSerialized = []
    for j in workouts:
        workoutSerialized.append(jsonifyWorkout(j))

    return jsonify(data={"workouts": workoutSerialized}, status={'code': 200, 'message': 'Success'})

@app.route('/deleteWorkout/<id>', methods=['DELETE'])
@login_required
def deleteWorkout(id):
    workouts = Workout.query.filter(Workout.user_id == session['_user_id']).all()
    deleteWorkout = Workout.query.get_or_404(id)
    for i in workouts:
        if(i == deleteWorkout):
            db.session.delete(deleteWorkout)
            db.session.commit()
            return jsonify(data={}, status={'code': 200, 'message': 'Success'})
        else:
            return jsonify(data={}, status={'code': 401, 'message': 'Workout does not exist or does not belong to the current signed in user'})
    return jsonify(data={}, status={'code': 401, 'message': 'Workout does not exist or does not belong to the current signed in user'})

@app.route('/getWorkout/<id>', methods=['GET'])
@login_required
def getWorkout(id):
    workout = Workout.query.get_or_404(id)
    if(workout == None):
        return jsonify(data={}, status={'code': 401, 'message': 'No Workout Found'})
    else:
        return jsonify(data=jsonifyWorkout(workout), status={'code': 200, 'message': 'Success'})

@app.route('/updateWorkout/<id>', methods=['PUT'])
@login_required
def updateWorkout(id):
    payload = request.get_json()
    current_workout = Workout.query.get_or_404(id)
    current_workout.muscle_group = payload['muscleGroup']
    skill_measures = SkillMeasure.query.filter(SkillMeasure.workout_id == current_workout.id).all()
    print(skill_measures)
    i = 0
    for skill_measure in skill_measures:
        try:
            skill_measure.exercise = payload['skillMeasures'][i]['exercise']
            skill_measure.reps_or_weight = payload['skillMeasures'][i]['repsOrWeight']
            skill_measure.current = payload['skillMeasures'][i]['current']
            skill_measure.target = payload['skillMeasures'][i]['target']
            db.session.add(skill_measure)
        except IndexError as e:
            print(e)
            db.session.delete(skill_measure)
        
        i += 1

    if(len(payload['skillMeasures']) > len(skill_measures)):
        for x in range(i, len(payload['skillMeasures'])):
            skill = SkillMeasure(
            exercise = payload['skillMeasures'][i]['exercise'],
            reps_or_weight = payload['skillMeasures'][i]['repsOrWeight'],
            current = payload['skillMeasures'][i]['current'],
            target = payload['skillMeasures'][i]['target'],
            workout = current_workout
            )    
        db.session.add(skill)
    db.session.add(current_workout)
    db.session.commit()
    return jsonify(body=jsonifyWorkout(current_workout), status={'status': 200, 'message': 'Workout Updated'})

@app.route('/updateSkillMeasure/<id>', methods=['PUT'])
@login_required
def updateSkillMeasure(id):
    payload = request.get_json()
    current_measure = SkillMeasure.query.get_or_404(id)
    current_measure.current = payload['current']
    db.session.add(current_measure)
    db.session.commit()
    return jsonify(body={}, status={'code': 200, 'message': 'Skill Measure Updated'})


@login_manager.unauthorized_handler
def unauthorized():
    return jsonify(data = {}, status={'code': 405, 'message': 'No user logged in'})

if __name__ == '__main__':
    app.run()