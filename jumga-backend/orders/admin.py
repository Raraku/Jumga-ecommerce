from accounts.models import SellerShop
from django.contrib import admin
from .models import Order, OrderLine, Basket, BasketLine
from datetime import datetime, timedelta
from django.contrib.auth.admin import UserAdmin as DjangoUserAdmin
from django.utils.html import format_html
from django.db.models.functions import TruncDay
from django.db.models import Avg, Count, Min, Sum
from django.urls import path
from django.template.response import TemplateResponse
from django.contrib import admin


class OrderLineAdmin(admin.ModelAdmin):
    model = OrderLine
    list_display = ("product", "status", "quantity", "total")
    readonly_fields = ("product", "status", "quantity", "total")
    list_filter = ("status",)

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        shop = SellerShop.objects.get(user=request.user)
        return qs.filter(product__shop=shop).exclude(status__in=(10, 40))


class CentralOfficeOrderAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "status")
    list_editable = ("status",)
    readonly_fields = ("user",)
    list_filter = ("status", "shipping_country", "date_added")


class DispatchersOrderAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "shipping_name",
        "date_added",
        "status",
    )
    list_filter = ("status", "shipping_country", "date_added")
    # inlines = (CentralOfficeOrderLineInline,)
    fieldsets = (
        (
            "Shipping info",
            {
                "fields": (
                    "shipping_name",
                    "shipping_address1",
                    "shipping_address2",
                    "shipping_zip_code",
                    "shipping_city",
                    "shipping_country",
                )
            },
        ),
    )
    # Dispatchers are only allowed to see orders that
    # are ready to be shipped
    def get_queryset(self, request):
        qs = super().get_queryset(request)
        return qs.filter(status=Order.PAID)


# Register your models here.
