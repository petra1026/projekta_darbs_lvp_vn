from flask import Flask, render_template, request, redirect, url_for, session, jsonify
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
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password_hash = db.Column(db.String(120), nullable=False)
    is_editor = db.Column(db.Boolean, default=False)

def get_user_by_username(username):
    try:
        user = User.query.filter_by(username=username).first()
        return user  
    except Exception as e:
        print(f"Kļūda meklējot lietotāju: {e}")
        return None

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
    try:
        print("=== LOGIN MĒĢINĀJUMS ===")  
        
        
        if not request.is_json:
            print("Nav JSON dati")
            return jsonify({"success": False, "message": "Nav JSON dati"}), 400
            
        data = request.get_json()
        print(f"Saņemtie dati: {data}")  
        
        if not data:
            return jsonify({"success": False, "message": "Tukši dati"}), 400
            
        username = data.get("username", "").strip()
        password = data.get("password", "")
        
        print(f"Lietotājvārds: '{username}', Parole garums: {len(password)}")  
        
        
        if not username or not password:
            return jsonify({"success": False, "message": "Trūkst lietotājvārda vai paroles"}), 400
        
        
        user = User.query.filter_by(username=username).first()
        print(f"Atrasts lietotājs: {user is not None}")  
        
        if user:
            print(f"Pārbauda paroli...")  
            
            if check_password_hash(user.password_hash, password):
                print("Parole pareiza!")  
                session['user_id'] = user.id
                session['username'] = user.username
                print(f"Session iestatīta: user_id={session.get('user_id')}, username={session.get('username')}")  
                return jsonify({"success": True, "message": "Ielogošanās veiksmīga!"})
            else:
                print("Parole nepareiza!") 
                return jsonify({"success": False, "message": "Nepareiza parole."})
        else:
            print("Lietotājs nav atrasts!")  
            return jsonify({"success": False, "message": "Lietotājs nav atrasts."})
            
    except Exception as e:
        print(f"Login kļūda: {e}") 
        return jsonify({"success": False, "message": f"Servera kļūda: {str(e)}"}), 500
    
    

@app.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('index'))

@app.route('/register', methods=['POST'])
def register():
    try:
        print("=== REĢISTRĀCIJAS MĒĢINĀJUMS ===")  
        
        if not request.is_json:
            return jsonify({"success": False, "message": "Nav JSON dati"}), 400
            
        data = request.get_json()
        if not data:
            return jsonify({"success": False, "message": "Tukši dati"}), 400
            
        username = data.get('username', '').strip()
        password = data.get('password', '')
        
        print(f"Reģistrē: '{username}', Parole garums: {len(password)}")  
        
        if not username or not password:
            return jsonify({"success": False, "message": "Trūkst lietotājvārda vai paroles"}), 400

        # Pārbauda vai lietotājs jau eksistē
        if User.query.filter_by(username=username).first():
            return jsonify({'success': False, 'message': 'Lietotājvārds jau eksistē!'})

        # Izveido jaunu lietotāju
        password_hash = generate_password_hash(password)
        new_user = User(username=username, password_hash=password_hash)
        
        print(f"Izveidots hash: {password_hash[:20]}...")  

        db.session.add(new_user)
        db.session.commit()
        
        print("Lietotājs veiksmīgi izveidots!") 
        return jsonify({'success': True, 'message': 'Reģistrācija veiksmīga!'})
        
    except Exception as e:
        print(f"Register kļūda: {e}")
        db.session.rollback()
        return jsonify({'success': False, 'message': f'Servera kļūda: {str(e)}'}), 500

@app.route('/pieraksti')
def pieraksti():
    print(f"Pieraksti lapa: user_id={session.get('user_id')}, username={session.get('username')}")  
    if 'user_id' not in session:
        print("Nav ielogojies, novirza uz sākumu")  
        return redirect(url_for('index'))
    return render_template('pieraksti.html')

@app.route('/check_session')
def check_session():
    return jsonify({
        'logged_in': 'user_id' in session,
        'user_id': session.get('user_id'),
        'username': session.get('username')
    })

if __name__ == '__main__':
    with app.app_context():
        try:
            db.create_all()
            print("Datubāze izveidota veiksmīgi!")
        except Exception as e:
            print(f"Datubāzes kļūda: {e}")
    
    app.run(debug=True)
