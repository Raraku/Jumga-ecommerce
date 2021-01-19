from rest_framework import serializers
from .models import ExchangeRate, Product, ProductReview, ProductImage
from taggit.models import Tag

from accounts.models import SellerShop


class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ("image", "thumbnail")


class ShopSerializer(serializers.ModelSerializer):
    class Meta:
        model = SellerShop
        fields = ("name", "paid_reg_fee", "id", "dispatcher")


class ProductInfoSerializer(serializers.ModelSerializer):
    productImage = ProductImageSerializer(many=True)

    class Meta:
        model = Product
        fields = (
            "name",
            "price",
            "productImage",
            "slug",
            "id",
            "rating",
            "ratingNumbers",
        )


class ProductSerializer(serializers.ModelSerializer):
    productImage = ProductImageSerializer(many=True)
    # seller = SellerSerializer()
    shop = ShopSerializer()

    class Meta:
        model = Product
        fields = (
            "name",
            "description",
            "price",
            "productImage",
            "slug",
            "shop",
            "id",
            "rating",
            "ratingNumbers",
        )


class ProductReviewSerializer(serializers.ModelSerializer):
    author = serializers.StringRelatedField()
    helpful = serializers.SerializerMethodField()

    class Meta:
        model = ProductReview
        fields = ("product", "author", "review", "date_added", "title", "helpful", "id")

    def get_helpful(self, obj):
        return obj.helpful.count()


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ["name", "id", "slug"]


class ExchangeRateSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExchangeRate
        fields = "__all__"
