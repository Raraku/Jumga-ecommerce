from django.urls import path
from .views import (
    ReceiveWebHook,
)

urlpatterns = [
    path("webhook/", ReceiveWebHook.as_view()),
]
