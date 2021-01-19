from django.db import models
from jumga.settings.dev import AUTH_USER_MODEL
from main.models import Product
from accounts.models import Customer
from django.core.validators import MinValueValidator

# Create your models here.
class Basket(models.Model):
    OPEN = 10
    SUBMITTED = 20
    STATUSES = ((OPEN, "Open"), (SUBMITTED, "Submitted"))
    user = models.OneToOneField(
        Customer, on_delete=models.CASCADE, blank=True, null=True
    )
    status = models.IntegerField(choices=STATUSES, default=OPEN)

    def is_empty(self):
        return self.basketline_set.all().count() == 0

    def count(self):
        return sum(i.quantity for i in self.basketline_set.all())

    def grand_total(self):
        return sum(i.total + i.delivery_fee for i in self.basketlines.all())

    def create_order(self, billing_address, shipping_address, user):
        customer = Customer.objects.get(user=user)
        order_data = {
            "user": customer,
            "total": self.grand_total(),
            "billing_name": billing_address["name"],
            "billing_address1": billing_address["address1"],
            "billing_state": billing_address["state"],
            "billing_zip_code": billing_address["zip_code"],
            "billing_city": billing_address["city"],
            "billing_country": billing_address["country"],
            "shipping_name": shipping_address["name"],
            "shipping_address1": shipping_address["address1"],
            "shipping_state": shipping_address["state"],
            "shipping_zip_code": shipping_address["zip_code"],
            "shipping_city": shipping_address["city"],
            "shipping_country": shipping_address["country"],
        }
        order = Order.objects.create(**order_data)
        for line in self.basketlines.all():
            order_line_data = {
                "order": order,
                "product": line.product,
                "quantity": line.quantity,
                "total": line.total,
                "delivery_fee": line.delivery_fee,
            }
            order_line = OrderLine.objects.create(**order_line_data)
        self.status = Basket.SUBMITTED
        self.save()
        return order.id


class BasketLine(models.Model):
    basket = models.ForeignKey(
        Basket, related_name="basketlines", on_delete=models.CASCADE
    )
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1, validators=[MinValueValidator(1)])
    total = models.FloatField(blank=True, null=True)
    delivery_fee = models.FloatField(blank=True, null=True)

    def save(self, *args, **kwargs):
        if self.product and self.quantity:
            self.total = int(self.product.price) * int(self.quantity)
            self.delivery_fee = self.total * 0.075
            super(BasketLine, self).save(*args, **kwargs)


class Order(models.Model):
    NEW = 10
    PAID = 20
    FULFILLED = 30
    STATUSES = ((NEW, "New"), (PAID, "Paid"), (FULFILLED, "Fulfilled"))
    total = models.PositiveIntegerField(blank=True, null=True)
    user = models.ForeignKey(Customer, on_delete=models.CASCADE)
    status = models.IntegerField(choices=STATUSES, default=NEW)
    billing_name = models.CharField(max_length=60)
    billing_address1 = models.CharField(max_length=60)
    billing_state = models.CharField(max_length=60, blank=True)
    billing_zip_code = models.CharField(max_length=12)
    billing_city = models.CharField(max_length=60)
    billing_country = models.CharField(max_length=3)
    shipping_name = models.CharField(max_length=60)
    shipping_address1 = models.CharField(max_length=60)
    shipping_state = models.CharField(max_length=60, blank=True)
    shipping_zip_code = models.CharField(max_length=12)
    shipping_city = models.CharField(max_length=60)
    shipping_country = models.CharField(max_length=3)
    shipping_same = models.BooleanField(default=False)
    date_updated = models.DateTimeField(auto_now=True)
    date_added = models.DateTimeField(auto_now_add=True)


class OrderLine(models.Model):
    NEW = 10
    PROCESSING = 20
    DELIVERED = 30
    CANCELLED = 40
    STATUSES = (
        (NEW, "New"),
        (PROCESSING, "Processing"),
        (DELIVERED, "Delivered"),
        (CANCELLED, "Cancelled"),
    )
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="lines")
    product = models.ForeignKey(Product, on_delete=models.PROTECT)
    status = models.IntegerField(choices=STATUSES, default=NEW)
    date_added = models.DateTimeField(auto_now_add=True)
    quantity = models.PositiveIntegerField(default=1, validators=[MinValueValidator(1)])
    total = models.FloatField(blank=True, null=True)
    delivery_fee = models.FloatField(blank=True, null=True)
