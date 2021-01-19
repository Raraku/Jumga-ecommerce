from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager
from jumga.settings.base import AUTH_USER_MODEL
from django.utils.text import slugify

# Create your models here.


class UserAccountManager(BaseUserManager):
    use_in_migrations = True

    def _create_user(self, username, email, password, **extra_fields):
        """
        Create and save a user with the given username, email, and password.
        """
        if not username:
            raise ValueError("The given username must be set")
        if not email:
            raise ValueError("You must provide an email")
        email = self.normalize_email(email)
        username = self.model.normalize_username(username)
        user = self.model(username=username, email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_user(self, username, email=None, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", False)
        extra_fields.setdefault("is_superuser", False)
        return self._create_user(username, email, password, **extra_fields)

    def create_superuser(self, username, email, password, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)

        if extra_fields.get("is_staff") is not True:
            raise ValueError("Superuser must have is_staff=True.")
        if extra_fields.get("is_superuser") is not True:
            raise ValueError("Superuser must have is_superuser=True.")

        return self._create_user(username, email, password, **extra_fields)


class User(AbstractUser):
    email = models.EmailField(("email address"), blank=False, unique=True)
    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username"]
    objects = UserAccountManager()

    def __str__(self):
        if self.first_name != "":
            return self.first_name + " " + self.last_name
        else:
            return self.username


class Customer(models.Model):
    user = models.OneToOneField(
        AUTH_USER_MODEL, on_delete=models.CASCADE, blank=True, null=True
    )
    # avatar = CloudinaryField("image", blank=True, null=True)
    # avatar_thumbnail = CloudinaryField("image", blank=True, null=True)
    slug = models.SlugField(blank=True)

    date_joined = models.DateField(auto_now_add=True)

    def save(self, *args, **kwargs):
        self.slug = slugify(str(self.user.username))
        super(Customer, self).save(*args, **kwargs)


# class Seller(models.Model):
#     user = models.OneToOneField(AUTH_USER_MODEL, on_delete=models.CASCADE)
#     slug = models.SlugField(blank=True)

#     date_created = models.DateField(auto_now_add=True)

#     def save(self, *args, **kwargs):
#         self.slug = slugify(str(self.user.username))
#         super(Seller, self).save(*args, **kwargs)


class Dispatcher(models.Model):
    user = models.OneToOneField(AUTH_USER_MODEL, on_delete=models.CASCADE)
    slug = models.SlugField(blank=True, null=True)
    name = models.CharField(max_length=48)
    date_created = models.DateField(auto_now_add=True)
    subaccount_id = models.CharField(max_length=50, blank=True, null=True)
    account_bank = models.CharField(max_length=5, blank=True, null=True)
    account_number = models.CharField(max_length=12, blank=True, null=True)
    country = models.CharField(
        max_length=3,
        default="NG",
    )
    # split_value won't be used
    split_value = models.FloatField(default=0.5)
    phone_number = models.IntegerField(blank=True, null=True)

    def save(self, *args, **kwargs):
        self.slug = slugify(str(self.name))
        super(Dispatcher, self).save(*args, **kwargs)

    def __str__(self):
        return self.name


class SellerShop(models.Model):
    user = models.OneToOneField(AUTH_USER_MODEL, on_delete=models.CASCADE)
    slug = models.SlugField(blank=True, null=True)
    name = models.CharField(max_length=48)
    date_created = models.DateField(auto_now_add=True)
    subaccount_id = models.CharField(max_length=50, blank=True, null=True)
    account_bank = models.CharField(max_length=5, blank=True, null=True)
    account_number = models.CharField(max_length=12, blank=True, null=True)
    country = models.CharField(
        max_length=3,
        default="NG",
    )
    # split_value won't be used
    split_value = models.FloatField(default=0.5)
    dispatcher = models.ForeignKey(
        Dispatcher, blank=True, null=True, on_delete=models.DO_NOTHING
    )
    phone_number = models.IntegerField(blank=True, null=True)
    paid_reg_fee = models.BooleanField(default=False)

    def save(self, *args, **kwargs):
        self.slug = slugify(str(self.name))
        super(SellerShop, self).save(*args, **kwargs)

    def __str__(self):
        return self.name


class Address(models.Model):
    SUPPORTED_COUNTRIES = (
        ("ng", "Nigeria"),
        ("uk", "United Kingdom"),
        ("gh", "Ghana"),
        ("ke", "Kenya"),
    )
    ADDRESS_TYPE = (("BA", "Billing Address"), ("SA", "Shipping Address"))
    user = models.ForeignKey(Customer, on_delete=models.CASCADE)
    name = models.CharField(max_length=60)
    address1 = models.CharField("Address line 1", max_length=60)
    type = models.CharField(max_length=2, choices=ADDRESS_TYPE)
    state = models.CharField("state", max_length=60)
    zip_code = models.CharField("ZIP/ Postal code", max_length=12)
    city = models.CharField(max_length=60)

    country = models.CharField(max_length=3, choices=SUPPORTED_COUNTRIES)

    def __str__(self):
        return ", ".join(
            [
                self.name,
                self.address1,
                self.address2,
                self.zip_code,
                self.city,
                self.country,
            ]
        )
