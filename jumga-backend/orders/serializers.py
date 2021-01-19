from main.serializers import ProductInfoSerializer, ProductSerializer
from rest_framework import serializers
from .models import Basket, BasketLine, Order, OrderLine
from main.serializers import ProductSerializer


class OrderLineSerializer(serializers.ModelSerializer):
    product = serializers.StringRelatedField()

    class Meta:
        model = OrderLine
        fields = ("id", "order", "product", "status", "quantity")
        read_only_fields = ("id", "order", "product")


class OrderLineDetailSerializer(serializers.ModelSerializer):
    product = ProductSerializer()

    class Meta:
        model = OrderLine
        fields = (
            "id",
            "order",
            "product",
            "status",
            "quantity",
            "delivery_fee",
            "total",
        )
        read_only_fields = ("id", "order", "product", "total")


class OrderDetailSerializer(serializers.ModelSerializer):
    lines = OrderLineDetailSerializer(many=True)

    class Meta:
        model = Order
        fields = (
            "shipping_name",
            "shipping_address1",
            "shipping_state",
            "shipping_zip_code",
            "shipping_city",
            "shipping_country",
            "billing_name",
            "billing_address1",
            "billing_state",
            "billing_zip_code",
            "billing_city",
            "billing_country",
            "date_updated",
            "date_added",
            "lines",
            "id",
            "status",
            "total",
        )


class OrderSerializer(serializers.HyperlinkedModelSerializer):
    lines = OrderLineSerializer(many=True)

    class Meta:
        model = Order
        fields = (
            "shipping_name",
            "shipping_address1",
            "shipping_state",
            "shipping_zip_code",
            "shipping_city",
            "shipping_country",
            "billing_name",
            "billing_address1",
            "billing_state",
            "billing_zip_code",
            "billing_city",
            "billing_country",
            "date_updated",
            "date_added",
            "lines",
            "id",
            "status",
            "total",
        )


class OrderInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = ("id", "status", "date_added", "total")


class BasketLineSerializer(serializers.ModelSerializer):
    product = ProductInfoSerializer()

    class Meta:
        model = BasketLine
        fields = ("product", "quantity", "total", "delivery_fee")


class BasketSerializer(serializers.ModelSerializer):
    basketlines = BasketLineSerializer(many=True)

    class Meta:
        model = Basket
        fields = ("basketlines", "id")
