from .base import *
import django_heroku
import dj_database_url
from google.oauth2 import service_account

DEBUG = False

DATABASES = {}
DATABASES["default"] = dj_database_url.config(conn_max_age=600, ssl_require=True)
CORS_ORIGIN_WHITELIST = [
    "https://jumga-1.netlify.app",
    "http://jumga-1.netlify.app",
    "https://jumgaapi.herokuapp.com",
]
ALLOWED_HOSTS += [
    "https://jumga-1.netlify.app",
    "http://jumga-1.netlify.app",
    "https://jumgaapi.herokuapp.com",
    "http://jumgaapi.herokuapp.com",
    "jumgaapi.herokuapp.com",
]
CSRF_TRUSTED_ORIGINS = [
    "localhost:3000",
    "https://jumga-1.netlify.app",
    "http://jumga-1.netlify.app",
    "https://jumgaapi.herokuapp.com",
    "http://jumgaapi.herokuapp.com",
]
FLUTTERWAVE_PUBLIC_KEY = os.getenv("FLUTTERWAVE_PUBLIC_KEY")
FLUTTERWAVE_SECRET_KEY = os.getenv("FLUTTERWAVE_SECRET_KEY")
DEFAULT_FILE_STORAGE = "jumga.settings.gcloud.GoogleCloudMediaFileStorage"
STATICFILES_STORAGE = "jumga.settings.gcloud.GoogleCloudStaticFileStorage"
GS_PROJECT_ID = "remakeu-5d060"
GS_STATIC_BUCKET_NAME = "remakeu-5d060.appspot.com"
GS_MEDIA_BUCKET_NAME = "remakeu-5d060.appspot.com"  # same as STATIC BUCKET if using single bucket both for static and media
GS_CREDENTIALS = service_account.Credentials.from_service_account_file(
    os.path.join(BASE_DIR, "remakeU-36d3620cc3ec.json")
)
STATIC_URL = "https://storage.googleapis.com/{}/static/".format(GS_STATIC_BUCKET_NAME)
STATIC_ROOT = "static/"

MEDIA_URL = "https://storage.googleapis.com/{}/media/".format(GS_MEDIA_BUCKET_NAME)
MEDIA_ROOT = "media/"