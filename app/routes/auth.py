from fastapi import APIRouter
from google.oauth2 import id_token
from google.auth.transport import requests
from jose import jwt
import os

router = APIRouter()



GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = "HS256"


@router.post("/google")
def google_login(data: dict):
    token = data.get("token")

    try:
        idinfo = id_token.verify_oauth2_token(token, requests.Request(), GOOGLE_CLIENT_ID)

        user_email = idinfo["email"]

        # create JWT
        jwt_token = jwt.encode({"sub": user_email}, SECRET_KEY, algorithm=ALGORITHM)

        return {"access_token": jwt_token}

    except Exception as e:
        return {"error": "Invalid Google token"}