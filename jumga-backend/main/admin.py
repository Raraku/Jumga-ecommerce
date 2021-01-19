from django.contrib import admin
from django.contrib.admin.filters import SimpleListFilter
from .models import Product, ProductImage, ProductReview, ExchangeRate
from datetime import datetime, timedelta
from django.contrib.auth.admin import UserAdmin as DjangoUserAdmin
from django.utils.html import format_html
from django.db.models.functions import TruncDay
from django.db.models import Avg, Count, Min, Sum
from django.urls import path
from django.template.response import TemplateResponse
from django.contrib import admin
from accounts.admin import Customer, User, SellerShop
from orders.admin import (
    DispatchersOrderAdmin,
    CentralOfficeOrderAdmin,
    OrderLineAdmin,
)
from payments.admin import Transaction
from orders.models import Order, OrderLine, Basket, BasketLine
from django.contrib.auth.models import Group, Permission
from payments.admin import SellerCommissionAdmin, JumgaCommissionAdmin
from payments.models import SellerCommission, JumgaCommission
from taggit.models import Tag
from accounts.models import Dispatcher

# Register your models here.


class ProductAdmin(admin.ModelAdmin):
    list_display = ("name", "price", "in_stock")
    list_filter = ("in_stock", "date_updated")
    list_editable = ("in_stock",)
    search_fields = ("name",)
    prepopulated_fields = {"slug": ("name",)}


class ProductImageInline(admin.TabularInline):
    max_num = 5
    readonly_fields = ("thumbnail",)
    model = ProductImage


class SellerProductAdmin(admin.ModelAdmin):
    list_display = ("name", "price", "in_stock")
    list_filter = ("in_stock", "date_updated")
    list_editable = ("in_stock",)
    readonly_fields = ("shop", "rating", "ratingNumbers")
    search_fields = ("name",)
    prepopulated_fields = {"slug": ("name",)}
    inlines = [
        ProductImageInline,
    ]

    def save_model(self, request, obj, form, change):
        obj.shop = SellerShop.objects.get(user=request.user)
        super().save_model(request, obj, form, change)

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        return qs.filter(shop__user=request.user)


class DispatchersProductAdmin(ProductAdmin):
    readonly_fields = ("description", "price", "categories", "in_stock")
    prepopulated_fields = {}
    autocomplete_fields = ()


class ColoredAdminSite(admin.sites.AdminSite):
    def each_context(self, request):
        context = super().each_context(request)
        context["site_header_color"] = getattr(self, "site_header_color", None)
        context["module_caption_color"] = getattr(self, "module_caption_color", None)
        return context


# The following will add reporting views to the list of
# available urls and will list them from the index page
class ReportingColoredAdminSite(ColoredAdminSite):
    def get_urls(self):
        urls = super().get_urls()
        my_urls = [
            path(
                "orders_per_day/",
                self.admin_view(self.orders_per_day),
            )
        ]
        return my_urls + urls

    def orders_per_day(self, request):
        starting_day = datetime.now() - timedelta(days=180)
        order_data = (
            OrderLine.objects.filter(date_added__gt=starting_day)
            .annotate(day=TruncDay("date_added"))
            .values("day")
            .annotate(c=Count("id"))
        )
        labels = [x["day"].strftime("%Y-%m-%d") for x in order_data]
        values = [x["c"] for x in order_data]
        context = dict(
            self.each_context(request),
            title="Orders per day",
            labels=labels,
            values=values,
        )
        return TemplateResponse(request, "orders_per_day.html", context)

    def index(self, request, extra_context=None):
        reporting_pages = [
            {
                "name": "Orders per day",
                "link": "orders_per_day/",
            }
        ]
        if not extra_context:
            extra_context = {}
            extra_context = {"reporting_pages": reporting_pages}
            return super().index(request, extra_context)


class OwnersAdminSite(ReportingColoredAdminSite):
    site_header = "Jumga owners administration"
    site_header_color = "black"
    module_caption_color = "grey"
    site_url = None

    def has_permission(self, request):
        return request.user.is_active and request.user.is_superuser


class SellersAdminSite(ReportingColoredAdminSite):
    site_header = "Jumga Seller Portal"
    site_header_color = "green"
    module_caption_color = "lightgreen"
    site_url = None
    index_title = "Hello, Seller. Have a great day"

    def has_permission(self, request):
        try:
            request.user.sellershop
            if request.user.sellershop.paid_reg_fee:
                return True
            return False
        except:
            return False


class DispatchersAdminSite(ColoredAdminSite):
    site_header = "Jumga central dispatch administration"
    module_caption_color = "pink"
    site_header_color = "purple"

    def has_permission(self, request):
        return request.user.is_active and request.user.is_dispatcher


main_admin = OwnersAdminSite("jumga-admin")
seller_admin = SellersAdminSite("seller-jumga")
dispatcher_admin = DispatchersAdminSite()

main_admin.register(Group)
main_admin.register(Permission)
main_admin.register(Product, ProductAdmin)
main_admin.register(ProductReview)
main_admin.register(ProductImage)
main_admin.register(Customer)
main_admin.register(User)
main_admin.register(SellerShop)
main_admin.register(Transaction)
main_admin.register(Order, CentralOfficeOrderAdmin)
main_admin.register(OrderLine)
main_admin.register(Basket)
main_admin.register(BasketLine)
main_admin.register(ExchangeRate)
main_admin.register(JumgaCommission, JumgaCommissionAdmin)
main_admin.register(Tag)
main_admin.register(Dispatcher)

seller_admin.register(Product, SellerProductAdmin)
# seller_admin.register(ProductImage, ProductImageAdmin)
seller_admin.register(OrderLine, OrderLineAdmin)
seller_admin.register(SellerCommission, SellerCommissionAdmin)
