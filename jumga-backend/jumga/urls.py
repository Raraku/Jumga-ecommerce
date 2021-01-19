"""jumga URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin as adm
from django.urls import path, include
from django.conf.urls.static import static
from django.conf import settings
from main import admin

urlpatterns = [
    path("central-admin/", admin.main_admin.urls),
    path("seller-admin/", admin.seller_admin.urls),
    path("dispatch-admin/", admin.dispatcher_admin.urls),
    path("api-auth/", include("rest_framework.urls")),
    path("accounts/", include("allauth.urls")),
    path("rest-auth/", include("rest_auth.urls")),
    path("rest-auth/registration/", include("rest_auth.registration.urls")),
    path("api/", include("main.urls")),
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)