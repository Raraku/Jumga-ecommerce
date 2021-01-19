from rest_framework import serializers, viewsets
from . import models


class ProductSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = models.Product
        fields = ("name", "description", "price")


class ProductViewSet(viewsets.ModelViewSet):
    queryset = models.Product.objects.all()
    serializer_class = ProductSerializer


class OrderLineSerializer(serializers.HyperlinkedModelSerializer):
    product = serializers.StringRelatedField()

    class Meta:
        model = models.OrderLine
        fields = ("id", "order", "product", "status")
        read_only_fields = ("id", "order", "product")


class PaidOrderLineViewSet(viewsets.ModelViewSet):
    queryset = models.OrderLine.objects.filter(status=models.OrderLine.NEW).order_by(
        "-date_added"
    )
    serializer_class = OrderLineSerializer


class OrderSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = models.Order
        fields = (
            "shipping_name",
            "shipping_address1",
            "shipping_address2",
            "shipping_zip_code",
            "shipping_city",
            "shipping_country",
            "date_updated",
            "date_added",
        )


class PaidOrderViewSet(viewsets.ModelViewSet):
    queryset = models.Order.objects.filter(status=models.Order.PAID).order_by(
        "-date_added"
    )
    serializer_class = OrderSerializer
