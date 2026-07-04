"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required
import smtplib
import ssl
from email.message import EmailMessage


SMTP_SERVER = "smtp.gmail.com".replace('\xa0', ' ')
PORT = 465
SENDER_EMAIL = "samuel.carmona.rodrigz@gmail.com".replace('\xa0', ' ')
PASSWORD = "".replace('\xa0', ' ')
RECEIVER_EMAIL = "yiselle.navarrete21@gmail.com".replace('\xa0', ' ')


api = Blueprint('api', __name__)


def send_email(subject, body):
    msg = EmailMessage()

    msg["Subject"] = "Succesfully created account"
    msg["From"] = SENDER_EMAIL
    msg["To"] = RECEIVER_EMAIL

    msg.set_content("Your account has been created successfully")

    html = f"""
    <html>
        <body>
            <h1>{subject.replace('\xa0', ' ')}</h1>
            <p>{body.replace('\xa0', ' ')}</p>
        </body>
    </html>
    """
    msg.add_alternative(html.replace('\xa0', ' '), subtype="html")

    context = ssl.create_default_context()
    with smtplib.SMTP_SSL(SMTP_SERVER, PORT, context=context) as server:
        server.login(SENDER_EMAIL, PASSWORD)
        server.send_message(msg)


CORS(api)


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200


@api.route("/login", methods=["POST"])
def login():
    email = request.json.get("email", None)
    password = request.json.get("password", None)

    user = User.query.filter_by(email=email, password=password).one_or_none()

    if not user or email != user.email or password != user.password:
        return jsonify({"msg": "Bad username or password"}), 401

    new_account_html = f"""
    <html>
        <body>
            <h1 style="color: green !important;">Account Created</h1>
            <p>Your account has been created successfully {email}</p>
        </body>
    </html>
    """

    send_email("Account Created",
               f"Your account has been created successfully {email}")

    access_token = create_access_token(identity=email)
    return jsonify(access_token=access_token, user=user.serialize()), 200


@api.route("/register", methods=["POST"])
def register_user():

    email = request.json.get("email", None)
    password = request.json.get("password", None)

    if not email or not password:
        return jsonify({"msg": "Field email and field password are required"}), 400

    new_user = User(email, password)

    try:
        db.session.add(new_user)
        db.session.commit()

    except Exception as e:
        return jsonify({"msg": f"Unexpected {e=}, {type(e)=}"}), 500

    return jsonify({"msg": "Created succesfully", "user": new_user.serialize()}), 201


@api.route("/protected", methods=["GET"])
@jwt_required()
def protected():
    # Access the identity of the current user with get_jwt_identity
    current_user = get_jwt_identity()
    return jsonify(logged_in_as=current_user), 200
