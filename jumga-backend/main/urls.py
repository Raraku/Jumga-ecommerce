from django.urls import path, include
from rest_framework import urlpatterns
from rest_framework.routers import DefaultRouter

from main.viewsets import ProductInfoViewSet, ProductViewset
from orders.viewsets import (
    OrderDetailViewset,
    OrderViewSet,
    BasketViewset,
    OrderInfoViewset,
)
from accounts.viewsets import CustomerDetailsView, AddressDetailsView, ShopViewSet


router = DefaultRouter()
router.register(r"products", ProductViewset, "products")
router.register(r"productinfo", ProductInfoViewSet, basename="productinfo")
router.register(r"orders", OrderViewSet, basename="orders")
router.register(r"orderinfo", OrderInfoViewset, basename="orderinfo")
router.register(r"orderdetail", OrderDetailViewset, basename="detail")
router.register(r"baskets", BasketViewset, basename="baskets")
router.register(r"shop", ShopViewSet, basename="shop")
router.register(r"accounts", CustomerDetailsView, basename="accounts")
router.register(r"addresses", AddressDetailsView, basename="addresses")

urlpatterns = [path("payments/", include("payments.urls"))]
urlpatterns += router.urls
