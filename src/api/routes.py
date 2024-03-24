"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
import datetime
import secrets
import re
from flask import Flask, request, jsonify, url_for, Blueprint
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from api.models import db, User
from api.utils import generate_sitemap, APIException
from flask_cors import CORS

api = Blueprint('api', __name__)

@api.after_request
def add_cors_headers(response):
    response.headers['Access-Control-Allow-Origin'] = 'https://glowing-space-fiesta-v6vqq7rgv9gvfpp4g-3000.app.github.dev'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type,Authorization'
    response.headers['Access-Control-Allow-Methods'] = 'GET,PUT,POST,DELETE'
    return response

# Allow CORS requests to this API
CORS(api)

@api.route('/hello', methods=['GET'])
def handle_hello():
    try:
        response_body = {
            "message": "Hello! I'm a message that came from the backend, check the network tab on the Google inspector and you will see the GET request"
        }
        return jsonify(response_body), 200
    except Exception as e:
        response_body = {
            "error": str(e)
        }
        return jsonify(response_body), 500

# Registro de usuario
@api.route('/signup', methods=['POST'])
def handle_signup():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"message": "No se proporcionaron datos"}), 400

        required_fields = ["first_name", "last_name", "birth_date", "country", "username", "email", "password"]
        for field in required_fields:
            if field not in data:
                return jsonify({"message": f"Campo '{field}' requerido"}), 400

        if not re.match(r"[^@]+@[^@]+\.[^@]+", data["email"]):
            return jsonify({"message": "Formato de email inválido"}), 400

         # Validar y parsear la fecha de nacimiento
        try:
            birth_date = datetime.datetime.strptime(data["birth_date"], "%d-%m-%Y")
            if birth_date > datetime.datetime.now():
                return jsonify({"message": "La fecha de nacimiento no puede estar en el futuro"}), 400
        except ValueError:
            return jsonify({"message": "Formato de fecha de nacimiento inválido. Debe ser DD-MM-YYYY"}), 400

        # Verificar si el nombre de usuario y el correo electrónico ya están en uso
        if User.query.filter_by(username=data['username']).first():
            return jsonify({"message": "El nombre de usuario ya está en uso"}), 400
        if User.query.filter_by(email=data['email']).first():
            return jsonify({"message": "El correo electrónico ya está en uso"}), 400


        user = User(
            first_name=data["first_name"],
            last_name=data["last_name"],
            birth_date=birth_date,  # Utilizar la fecha de nacimiento parseada
            country=data["country"],
            username=data["username"],
        )
        user.set_email_address(data["email"])  # Usa el método de validación de email
        user.set_password_hash(data["password"])
        user.save()

        return jsonify(user.serialize()), 201

    except ValueError as ve:
        return jsonify({"message": str(ve)}), 400
    except Exception as e:
        return jsonify({"message": "Error interno del servidor"}), 500

# Inicio de sesión
@api.route('/login', methods=['POST'])
def handle_login():
    try:
        username = request.json.get("username", None)
        password = request.json.get("password", None)

        if not username or not password:
            return jsonify({"msg": "Falta el nombre de usuario o la contraseña"}), 400

        # Consulta la base de datos por el nombre de usuario
        user = User.query.filter_by(username=username).first()

        if user is None or not user.check_password(password):
            return jsonify({"msg": "Nombre de usuario o contraseña incorrectos"}), 401

        # Crea un nuevo token con el id de usuario dentro
        access_token = create_access_token(identity=user.id)
        return jsonify({ "token": access_token, "user_id": user.id, "username": username })

    except Exception as e:
        return jsonify({"msg": f"Error interno del servidor: {str(e)}"}), 500

# Cierre de sesión
@api.route('/logout', methods=['POST'])
@jwt_required()
def handle_logout():
    try:
        # Obtiene el identificador del usuario del token
        current_user_id = get_jwt_identity()

        # Crear un nuevo token de acceso con una duración corta para evitar posibles reutilizaciones
        new_access_token = create_access_token(identity=current_user_id, expires_delta=False)

        response = jsonify({"message": "Sesión cerrada exitosamente"})
        
        # Añade el nuevo token al header de la respuesta para que el cliente lo borre también
        response.headers["X-CSRF-TOKEN"] = secrets.token_hex(16)
        response.headers["X-NEW-ACCESS-TOKEN"] = new_access_token
        
        return response

    except Exception as e:
        return jsonify({"message": f"Error interno del servidor: {str(e)}"}), 500

# GET del perfil 
@api.route('/profile', methods=['GET'])
@jwt_required()
def handle_get_user():
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user:
            return jsonify({"message": "Usuario no encontrado"}), 404

        return jsonify(user.serialize()), 200

    except Exception as e:
        return jsonify({"message": f"Error interno del servidor: {str(e)}"}), 500
