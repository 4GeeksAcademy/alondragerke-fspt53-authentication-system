from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import generate_password_hash, check_password_hash
import re


db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'user'
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(120), nullable=False)
    last_name = db.Column(db.String(120), nullable=False)
    birth_date = db.Column(db.Date, nullable=False)
    country = db.Column(db.String(120), nullable=False)    
    username = db.Column(db.String(120), unique=True, nullable=False, index=True)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    password = db.Column(db.String(128), nullable=False)
    # is_active = db.Column(db.Boolean(), nullable=False, default=True)

    def validate_email(self, email):
        regex = r'^[\w\.-]+@[\w\.-]+\.\w+$'
        return re.match(regex, email) is not None

    def set_email_address(self, email):
        if not self.validate_email(email):
            raise ValueError("Invalid email address")
        self.email = email

    def set_password_hash(self, password):
        # Verificar la longitud mínima de la contraseña
        if len(password) < 8:
            raise ValueError("Password must be at least 8 characters long.")

        # Verificar si la contraseña contiene al menos una letra mayúscula
        if not re.search(r"[A-Z]", password):
            raise ValueError("Password must contain at least one uppercase letter.")

        # Verificar si la contraseña contiene al menos un número
        if not re.search(r"\d", password):
            raise ValueError("Password must contain at least one digit.")

        # Verificar si la contraseña contiene al menos un carácter especial
        if not re.search(r"[!@#$%^&*]", password):
            raise ValueError("Password must contain at least one special character.")

        try:
            # Aplicar el hash a la contraseña con la sal
            hashed_password = generate_password_hash(password).decode('utf-8')
            self.password = hashed_password
            print("Hashed password:", hashed_password)
        except Exception as e:
            print("Error setting password hash:", e)

    def check_password(self, password):
        try:
            # Verificar la contraseña concatenada con la contraseña almacenada
            is_valid_password = check_password_hash(self.password, password)
            print("Password is valid:", is_valid_password)
            return is_valid_password
        except Exception as e:
            print("Error checking password:", e)
            return False

    def save(self):
        # Guardar el usuario en la base de datos
        db.session.add(self)
        db.session.commit()

    def __repr__(self):
        return f'<User id={self.id}, username={self.username}>'


    def serialize(self):
        return {
            "id": self.id,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "birth_date": self.birth_date,
            "country": self.country,
            "username": self.username,         
            "email": self.email,
        }
