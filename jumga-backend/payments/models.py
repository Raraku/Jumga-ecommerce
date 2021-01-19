from django.db import models
from django.contrib.auth import get_user_model
from orders.models import Order, OrderLine
from accounts.models import Customer, SellerShop

# Create your models here.

transaction_type_choices = (
    ("purchase", "purchase"),
    ("registration", "registration"),
    ("withdrawal", "withdrawal"),
)

commission_type = (("purchase", "purchase"), ("dispatch", "dispatch"))

charge_type_choices = (("debit", "debit"), ("credit", "credit"))


class Transaction(models.Model):
    order = models.ForeignKey(Order, on_delete=models.SET_NULL, blank=True, null=True)
    initiated_by = models.ForeignKey(
        Customer,
        models.SET_NULL,
        null=True,
        related_name="buyer",
        blank=True,
    )
    # For seller registration
    initiated_by_seller = models.ForeignKey(
        SellerShop, models.SET_NULL, null=True, related_name="seller", blank=True
    )
    currency = models.CharField(max_length=3, default="NGN")
    type = models.CharField(choices=transaction_type_choices, max_length=20)
    successful = models.BooleanField(default=False)
    reference_code = models.CharField(max_length=100)
    flutterwave_reference = models.CharField(max_length=100, null=True, blank=True)
    amount = models.FloatField(default=0)
    date = models.DateTimeField(auto_now_add=True)
    charge_type = models.CharField(
        max_length=10, default="debit", choices=charge_type_choices
    )

    def __str__(self):
        return self.reference_code


class SellerCommission(models.Model):
    shop = models.ForeignKey(
        SellerShop, blank=True, null=True, on_delete=models.SET_NULL
    )
    amount = models.FloatField(default=0)
    type = models.CharField(
        choices=commission_type, max_length=20, default=commission_type[0][0]
    )
    orderline = models.OneToOneField(
        OrderLine, on_delete=models.DO_NOTHING, blank=True, null=True
    )
    time = models.DateTimeField(auto_now_add=True)


class JumgaCommission(models.Model):
    amount = models.FloatField(default=0)
    type = models.CharField(
        choices=commission_type, max_length=20, default=commission_type[0][0]
    )
    time = models.DateTimeField(auto_now_add=True)
    orderline = models.OneToOneField(
        OrderLine, on_delete=models.DO_NOTHING, blank=True, null=True
    )


class DispatchCommission(models.Model):
    # dispatcher =
    amount = models.FloatField(default=0)
    type = models.CharField(
        choices=commission_type, max_length=20, default=commission_type[1][0]
    )
    time = models.DateTimeField(auto_now_add=True)
    orderline = models.OneToOneField(
        OrderLine, on_delete=models.DO_NOTHING, blank=True, null=True
    )
