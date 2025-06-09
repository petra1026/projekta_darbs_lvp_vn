from flask import Flask, render_template, request, redirect,url_for, session, jsonify
from flask_sqlalchemy import SQLAlchemy 
from werkzeug.security import generate_password_hash, check_password_hash
import os 

app = Flask(__name__)
app.config['SECRET_KEY'] = 'jūsu-slepenā-atslēga-šeit'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///paligs.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False 

db =  SQLAlchemy(app)

#Datubāzes modelis
class User(db.Model):
    id = db.Column(db.Integer, pirmary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password_hash = db.Column(db.String(120), nullable=False)
    is_editor = db.Column(db.Boolean, default=False)

#Routes
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/morfologija')
def morfologija():
    return render_template('morfologija.html')

@app.route('/sintakse')
def sintakse():
    return render_template('sintakse.html')

@app.route('/leksikologija')
def leksikologija():
    return render_template('leksikologija.html')

@app.route('/login', methods=['POST'])
def login():
    username = request.json.get('username')
    password = request.json.get('password')

    user = User.query.filter_by(username=username).first()

    if user and check_password_hash(user.password_hash, password):
        session['user_id'] = user.id
        session['username'] = user.username
        session['is_editor'] = user.is_editor
        return jsonify({'success': True, 'message': 'Sekmīgi ielogojāties!'})
        else: return jsonify({'success': False, 'message': 'Nepareizs lietotājvārds vai parole!'})

@app.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('index'))

@app.route('/register', methods=['POST'])
def register():
    username = request.json.get('username')
    password = request.json.get('password')

    if User.query.filter_by
    (username=username).first():
        return jsonify({'success': False, 'message': 'Lietotājvārds jau eksistē!'})

    password_hash = generate_password_hash(password)
    new_user = User(username=username, password_hash=password_hash)

    db.session.add(new_user)
    db.session.commit()

    return jsonify({'success': True, 'message': 'Reģistrācija veiksmīga!'})

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)
