"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
import os
import datetime
import re
from flask import Flask, request, jsonify, url_for, Blueprint
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from api.models import db, User
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash


api = Blueprint('api', __name__)

# Allow CORS requests to this API
# CORS(api) 
# CORS(api, resources={r"/api/*": {"origins": "https://glowing-space-fiesta-v6vqq7rgv9gvfpp4g-3001.app.github.dev"}})
CORS(api, resources={"*": {"origins": "*"}})


# Función de ayuda para validar el formato del correo electrónico
def is_valid_email(email):
    # Patrón de expresión regular para validar el formato del correo electrónico
    email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    # Comprobar si el correo electrónico coincide con el patrón
    if re.match(email_pattern, email):
        return True
    else:
        return False

@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():
    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }
    return jsonify(response_body), 200

# Registro de usuario
@api.route('/auth/signup', methods=['POST'])
def handle_signup():
    data = request.json
    if not data:
        return jsonify({"message": "No se proporcionaron datos"}), 400
    
    required_fields = ["firstName", "lastName", "birthDate", "country", "username", "email", "password"]
    for field in required_fields:
        if field not in data:
            return jsonify({"message": f"Campo '{field}' requerido"}), 400
        
    if not is_valid_email(data["email"]):
        return jsonify({"message": "Formato de correo electrónico inválido"}), 400

    if len(data["password"]) < 6:
        return jsonify({"message": "La contraseña debe tener al menos 6 caracteres"}), 400

    try:
        # Parsear la fecha de nacimiento en el formato DD-MM-YYYY
        birth_date = datetime.datetime.strptime(data["birthDate"], "%d-%m-%Y")
        if birth_date > datetime.datetime.now():
            return jsonify({"message": "La fecha de nacimiento no puede estar en el futuro"}), 400
    except ValueError:
        return jsonify({"message": "Formato de fecha de nacimiento inválido. Debe ser DD-MM-YYYY"}), 400

    if User.query.filter_by(username=data['username']).first():
        return jsonify({"message": "El nombre de usuario ya está en uso"}), 400
    if User.query.filter_by(email=data['email']).first():
        return jsonify({"message": "El correo electrónico ya está en uso"}), 400

    new_user = User(
        firstName=data["firstName"],
        lastName=data["lastName"],
        birthDate=birth_date,  # Utilizar la fecha de nacimiento parseada
        country=data["country"],
        username=data["username"],
        email=data["email"],
    )
    new_user.set_password(data["password"])

    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "Usuario registrado exitosamente"}), 201

# Inicio de sesión
@api.route('/auth/login', methods=['POST'])
def handle_login():
    data = request.json
    if not data:
        return jsonify({"message": "No se proporcionaron datos"}), 400
    
    if "username" not in data or "password" not in data:
        return jsonify({"message": "Nombre de usuario y contraseña requeridos"}), 400

    username = data["username"]
    password = data["password"]

    user = User.query.filter_by(username=username).first()

    if user and user.check_password(password):  # Aquí se usa check_password
        access_token = create_access_token(identity=user.id)
        print("Token generado:", access_token)  # Agregado para depuración
        return jsonify({"access_token": access_token}), 200
    else:
        return jsonify({"message": "Nombre de usuario o contraseña incorrectos"}), 401


# Ruta privada
@api.route('/private', methods=['GET'])
@jwt_required()
def private_route():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    print("Current User:", user.username)  # Agregado para depuración
    return jsonify({"message": f"Bienvenido, {user.username}"}), 200


# Cierre de sesión
@api.route('/auth/logout', methods=['POST'])
@jwt_required()
def handle_logout():
    return jsonify({"message": "Sesión cerrada exitosamente"}), 200

@api.route('/auth/edit/<int:user_id>', methods=['PUT'])
@jwt_required()
def handle_edit_user(user_id):
    data = request.json
    if not data:
        return jsonify({"message": "No se proporcionaron datos"}), 400

    user = User.query.get(user_id)
    if not user:
        return jsonify({"message": "Usuario no encontrado"}), 404

    if "firstName" in data:
        user.firstName = data["firstName"]
    if "lastName" in data:
        user.lastName = data["lastName"]
    if "birthDate" in data:
        user.birthDate = data["birthDate"]
    if "country" in data:
        user.country = data["country"]
    if "username" in data:
        if data['username'] != user.username and User.query.filter_by(username=data['username']).first():
            return jsonify({"message": "El nombre de usuario ya está en uso"}), 400
        user.username = data["username"]
    if "email" in data:
        if data['email'] != user.email and User.query.filter_by(email=data['email']).first():
            return jsonify({"message": "El correo electrónico ya está en uso"}), 400
        user.email = data["email"]
    if "password" in data:
        user.password_hash = generate_password_hash(data["password"])

    db.session.commit()

    return jsonify({"message": "Usuario actualizado exitosamente"}), 200

@api.route('/auth/user/<int:user_id>', methods=['GET'])
@jwt_required()
def handle_get_user(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"message": "Usuario no encontrado"}), 404

    return jsonify(user.serialize()), 200