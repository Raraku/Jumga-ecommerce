from django.db.models.signals import post_save
from jumga.settings.dev import AUTH_USER_MODEL
from django.dispatch import receiver
from .models import Customer


@receiver(post_save, sender=AUTH_USER_MODEL)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        Customer.objects.create(user=instance)


@receiver(post_save, sender=AUTH_USER_MODEL)
def save_user_profile(sender, instance, **kwargs):
    instance.customer.save()