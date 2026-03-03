"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from api.models import User, People, Planet, Favorite
from api.extensions import bcrypt
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity

api = Blueprint('api', __name__)
# Allow CORS requests to this API
CORS(api)


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200


# [GET] /people Listar todos los registros de people en la base de datos.


@api.route('/people', methods=['GET'])
def get_people():
    # consultar todos los registros de la tabla
    people_query = People.query.all()
    # Convertimos los objetos de python a una lista de diccionarios JSON (bucle for)
    results = [person.serialize() for person in people_query]
    # Retornamos la lista con codigo 200 (ok)
    return jsonify(results), 200

# [GET] /people/<int:people_id> Muestra la información de un solo personaje según su id.


@api.route('/people/<int:people_id>', methods=['GET'])
def get_one_person(people_id):
    person = People.query.get(people_id)

    if person is None:
        return jsonify({"msg": "Ese personaje no existe en esta galaxia"}), 404

    return jsonify(person.serialize()), 200

# [GET] /planets Listar todos los registros de planets en la base de datos.


@api.route('/planets', methods=['GET'])
def get_planet():
    # consultar todos los registros de la tabla
    planets_query = Planet.query.all()
    # Convertimos los objetos de python a una lista de diccionarios JSON (bucle for)
    results = [planet.serialize() for planet in planets_query]
    # Retornamos la lista con codigo 200 (ok)
    return jsonify(results), 200

# [GET] /planets/<int:planet_id> Muestra la información de un solo planeta según su id.


@api.route('/planet/<int:planet_id>', methods=['GET'])
def get_one_planet(planet_id):
    planet = Planet.query.get(planet_id)

    if planet is None:
        return jsonify({"msg": "Ese planeta no existe en esta galaxia"}), 404

    return jsonify(planet.serialize()), 200

# [GET] /users Listar todos los usuarios del blog.


@api.route('/users', methods=['GET'])
def get_users():
    users_query = User.query.all()
    results = [user.serialize() for user in users_query]
    return jsonify(results), 200

# [GET] /users/favorites Listar todos los favoritos que pertenecen al usuario actual.


@api.route('/users/favorites', methods=['GET'])
@jwt_required()  # <--- Esto obliga a que el Front envíe el Token
def get_user_favorites():
    # Simulamos que somos el usuario con ID 1 ya que aun no hay login
    current_user_id = get_jwt_identity()
    # Buscamos en la tabla Favorite todos los que tengan user_id == 1
    # Usamos .filter_by() para filtrar
    favorites_query = Favorite.query.filter_by(user_id=current_user_id).all()
    # Serializamos la lista de favoritos
    results = [fav.serialize() for fav in favorites_query]

    return jsonify(results), 200

# [POST] /favorite/planet/<int:planet_id> Añade un nuevo planet favorito al usuario actual con el id = planet_id.


@api.route('/favorite/planet/<int:planet_id>', methods=['POST'])
@jwt_required()
def add_favorite_planet(planet_id):
    # Simular usuario ID 1
    user_id = get_jwt_identity()
    # 1. VALIDACION si ya existe el favorito en la base de datos.
    # Se busca un registro que coincida con los dos IDs
    exist = Favorite.query.filter_by(user_id=1, planet_id=planet_id).first()

    if exist:
        # Si "exist" no es None, quiere decir que el planeta ya esta en favoritos
        return jsonify({"msg": "El usuario ya tiene este planeta en sus favoritos"}), 400
    # 2. Si el planeta no existe se agrega a Favoritos
    # 3. Se crea una nueva instancia del modelo Favorite
    # Le pasamos el usuario y el planeta que queremos conectar
    new_favorite = Favorite(user_id=user_id, planet_id=planet_id)
    # 4. La session de la DB es como un carrito de compra
    try:
        db.session.add(new_favorite)  # Metemos el cambio al carrito
        db.session.commit()          # Pagamos/confirmamos la transaccio
        return jsonify({"msg": "Planeta agregado a favoritos"}), 201
    except Exception as error:
        # Si algo falla durante el commit, "limpiamos" el carrito de la base de datos para que no se quede trabado con errores.
        db.session.rollback()
        return jsonify({"msg": "Error al guardar: " + str(error)}), 500


# [POST] /favorite/people/<int:people_id> Añade un nuevo people favorito al usuario actual con el id = people_id.

@api.route('/favorite/people/<int:people_id>', methods=['POST'])
@jwt_required()
def add_favorite_person(people_id):
    # Simular usuario ID 1
    user_id = get_jwt_identity()
    # 1. VALIDACION si ya existe el favorito en la base de datos.
    # Se busca un registro que coincida con los dos IDs
    exist = Favorite.query.filter_by(user_id=1, people_id=people_id).first()

    if exist:
        # Si "exist" no es None, quiere decir que el planeta ya esta en favoritos
        return jsonify({"msg": "El usuario ya tiene este personaje en sus favoritos"}), 400
    # 2. Si el planeta no existe se agrega a Favoritos
    # 3. Se crea una nueva instancia del modelo Favorite
    # Le pasamos el usuario y el planeta que queremos conectar
    new_favorite = Favorite(user_id=user_id, people_id=people_id)
    # 4. La session de la DB es como un carrito de compra
    try:
        db.session.add(new_favorite)  # Metemos el cambio al carrito
        db.session.commit()          # Pagamos/confirmamos la transaccio
        return jsonify({"msg": "Personaje agregado a favoritos"}), 201
    except Exception as error:
        # Si algo falla durante el commit, "limpiamos" el carrito de la base de datos para que no se quede trabado con errores.
        db.session.rollback()
        return jsonify({"msg": "Error al guardar: " + str(error)}), 500


# [DELETE] /favorite/planet/<int:planet_id> Elimina un planet favorito con el id = planet_id.

@api.route('/favorite/planet/<int:planet_id>', methods=['DELETE'])
@jwt_required()
def delete_favorite_planet(planet_id):
    # Simular usuario ID 1
    user_id = get_jwt_identity()
    # 1 Buscamos el favorito en la DB
    favorite = Favorite.query.filter_by(
        user_id=user_id, planet_id=planet_id).first()

    if favorite is None:
        return jsonify({"msg": "Planeta favorito no encontrado"}), 404

    try:
        db.session.delete(favorite)
        db.session.commit()
        return jsonify({"msg": "Planeta eliminado de favoritos"}), 200
    except Exception as error:
        db.session.rollback()
        return jsonify({"msg": "Error al eliminar: " + str(error)}), 500


# [DELETE] /favorite/people/<int:people_id> Elimina un people favorito con el id = people_id.

@api.route('/favorite/people/<int:people_id>', methods=['DELETE'])
@jwt_required()
def delete_favorite_people(people_id):
    # Simular usuario ID 1
    user_id = get_jwt_identity()
    # 1 Buscamos el favorito en la DB
    favorite = Favorite.query.filter_by(
        user_id=user_id, people_id=people_id).first()

    if favorite is None:
        return jsonify({"msg": "Personaje favorito no encontrado"}), 404

    try:
        db.session.delete(favorite)
        db.session.commit()
        return jsonify({"msg": "Personaje eliminado de favoritos"}), 200
    except Exception as error:
        db.session.rollback()
        return jsonify({"msg": "Error al eliminar: " + str(error)}), 500

# [POST] /signup Con este endpoint el usuario puede registrarse y aqui es donde hasheamos la clave para que, si alguien hackea la base de datos, no vea la palabra real.


@api.route('/signup', methods=['POST'])
def signup():
    # Capturar los datos del Front-end
    body = request.get_json()
    email = body.get("email")
    password = body.get("password")
    # Validar que no lleguen vacíos
    if email is None or password is None:
        return jsonify({"msg": "Debes enviar email y password"}), 400

    user_exists = User.query.filter_by(email=email).first()
    # Validar si ya existe en la DB
    if user_exists:
        return jsonify({"msg": "El usuario ya existe"}), 400
    # Hashear la contraseña (Se genera un string largo y seguro)
    password_hash = bcrypt.generate_password_hash(password).decode('utf-8')
    # Crear la instancia del modelo con la clave encriptada
    new_user = User(email=email, password=password_hash, is_active=True)

    # Intentar guardar en la Base de Datos
    try:
        db.session.add(new_user)
        db.session.commit()
        return jsonify({"msg": "Usuario creado"}), 201
    except Exception as error:
        db.session.rollback()
        return jsonify({"msg": "Error al crear usuario: " + str(error)}), 500


@api.route('/login', methods=['POST'])
def login():
    body = request.get_json()
    email = body.get("email")
    password = body.get("password")

    user = User.query.filter_by(email=email).first()

    # 1. ¿Existe el usuario?
    if user is None:
        return jsonify({"msg": "Usuario no encontrado"}), 401

    # 2. ¿Es válida la contraseña?
    # bcrypt.check_password_hash devuelve un BOOLEANO (True o False)
    is_valid = bcrypt.check_password_hash(user.password, password)

    print(f"¿Contraseña válida?: {is_valid}")  # Mira tu terminal

    if not is_valid:  # Si es False...
        return jsonify({"msg": "Contraseña incorrecta"}), 401

    # 3. SOLO si pasó los dos filtros anteriores, creamos el token
    access_token = create_access_token(identity=str(user.id))
    return jsonify({"token": access_token}), 200
