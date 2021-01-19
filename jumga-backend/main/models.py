from accounts.models import Customer, SellerShop
from django.db import models
from taggit.managers import TaggableManager
from django.core.validators import MaxValueValidator, MinValueValidator
import logging
from jumga.settings.base import AUTH_USER_MODEL
from django.utils.text import slugify

# Create your models here.


class Product(models.Model):
    name = models.CharField(max_length=70)
    shop = models.ForeignKey(
        SellerShop, on_delete=models.CASCADE, related_name="products"
    )
    description = models.TextField(blank=True)
    price = models.FloatField()
    slug = models.SlugField(max_length=70, blank=True, null=True)
    active = models.BooleanField(default=True)
    in_stock = models.BooleanField(default=True)
    date_updated = models.DateTimeField(auto_now=True)
    categories = TaggableManager()
    rating = models.FloatField(blank=True, null=True, default=0)
    ratingNumbers = models.PositiveIntegerField(default=0)

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        self.slug = slugify(str(self.name))
        super(Product, self).save(*args, **kwargs)


class ProductImage(models.Model):
    product = models.ForeignKey(
        Product, related_name="productImage", on_delete=models.CASCADE
    )
    image = models.ImageField(upload_to="product-images/", blank=True, null=True)
    thumbnail = models.ImageField(
        upload_to="product-thumbnails/", null=True, blank=True
    )


class ProductReview(models.Model):
    product = models.ForeignKey(
        Product, on_delete=models.CASCADE, related_name="reviews"
    )
    author = models.ForeignKey(AUTH_USER_MODEL, on_delete=models.DO_NOTHING)
    review = models.TextField()
    title = models.CharField(max_length=70)
    date_added = models.DateTimeField(auto_now_add=True)
    helpful = models.ManyToManyField(
        AUTH_USER_MODEL, blank=True, related_name="helpful"
    )
    rating = models.PositiveIntegerField(
        validators=(MinValueValidator(0), MaxValueValidator(5)), blank=True, null=True
    )

    def __str__(self):
        return self.author.username + " - " + self.title[:20] + "..."


class ExchangeRate(models.Model):
    GBP = models.FloatField(blank=True, null=True)
    KES = models.FloatField(blank=True, null=True)
    GHS = models.FloatField(blank=True, null=True)
    NGN = models.FloatField(blank=True, null=True)
    USD = models.FloatField(blank=True, null=True)
    last_updated = models.DateField(auto_now=True)