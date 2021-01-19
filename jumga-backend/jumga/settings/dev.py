from .base import *


ACCOUNT_USERNAME_REQUIRED = False
ACCOUNT_EMAIL_REQUIRED = True
ACCOUNT_AUTHENTICATION_METHOD = "email"
ACCOUNT_EMAIL_VERIFICATION = "none"
EMAIL_BACKEND = "django.core.mail.backends.console.EmailBackend"
ACCOUNT_CONFIRM_EMAIL_ON_GET = True

AUTHENTICATION_BACKENDS = (
    "django.contrib.auth.backends.ModelBackend",
    "allauth.account.auth_backends.AuthenticationBackend",
)
LOGIN_REDIRECT_URL = "/"


"""Use this for development"""


ALLOWED_HOSTS += [
    "127.0.0.1",
    "localhost",
    "192.168.43.127",
    "192.168.43.127:8000",
    "localhost:3000",
    "http://localhost:3000",
]
DEBUG = True


CORS_ORIGIN_ALLOW_ALL = True
CORS_ORIGIN_WHITELIST = [
    "http://localhost:3000",
    "https://localhost:3000",
    "http://localhost:5000",
    "https://localhost:8000",
    "http://localhost:8000",
    "https://djreact.netlify.com",
    "http://djreact.netlify.com",
    "http://192.168.43.127:3000",
    "http://192.168.43.127",
    "http://192.168.43.127:8000",
]

CSRF_TRUSTED_ORIGINS = [
    "djreact.netlify.com",
    "http://192.168.43.127:3000",
    "http://192.168.43.127:8000",
    "http://192.168.43.127",
    "http://localhost:3000",
    "localhost:3000",
]

PUSH_NOTIFICATIONS_SETTINGS = {
    "FCM_API_KEY": "AIzaSyCZphUPPbPM7B3exfrwND5wI-YIeq9j_hU",
}

FLUTTERWAVE_PUBLIC_KEY = os.getenv("FLUTTERWAVE_TEST_PUBLIC_KEY")
FLUTTERWAVE_SECRET_KEY = os.getenv("FLUTTERWAVE_TEST_SECRET_KEY")