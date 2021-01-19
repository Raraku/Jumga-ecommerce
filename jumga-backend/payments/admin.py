from payments.models import Transaction
from django.contrib import admin
from .models import SellerCommission, JumgaCommission, DispatchCommission
from accounts.models import SellerShop

# Register your models here.
class SellerCommissionAdmin(admin.ModelAdmin):
    model = SellerCommission
    list_display = ("amount", "type", "orderline", "time")
    readonly_fields = ("amount", "type", "orderline", "time")
    list_filter = ("time",)

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        shop = SellerShop.objects.get(user=request.user)
        return qs.filter(shop=shop)


class JumgaCommissionAdmin(admin.ModelAdmin):
    model = JumgaCommission
    list_display = ("amount", "type", "orderline", "time")
    readonly_fields = ("amount", "type", "orderline", "time")
    list_filter = ("time",)


# class DispatchCommissionCommissionAdmin(admin.ModelAdmin):
#     model = DispatchCommission
#     list_display = ("amount", "type", "orderline", "total", "time")
#     readonly_fields = ("amount", "type", "orderline", "total", "time")
#     list_filter = ("time",)

#     def get_queryset(self, request):
#         qs = super().get_queryset(request)
#         shop = SellerShop.objects.get(user=request.user)
#         return qs.filter(shop=shop)
