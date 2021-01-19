from rest_framework import serializers
from django.contrib.auth import get_user_model
from jumga.settings.base import AUTH_USER_MODEL
from .models import Address, Customer, User


class UserViewSerializer(serializers.ModelSerializer):
    class Meta:
        model = User


class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = "__all__"


class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = "__all__"
