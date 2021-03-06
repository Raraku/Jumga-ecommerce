# Generated by Django 3.1.5 on 2021-01-13 15:02

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('orders', '0004_basketline_delivery_fee'),
    ]

    operations = [
        migrations.AddField(
            model_name='orderline',
            name='delivery_fee',
            field=models.DecimalField(blank=True, decimal_places=2, max_digits=10, null=True),
        ),
        migrations.AddField(
            model_name='orderline',
            name='total',
            field=models.DecimalField(blank=True, decimal_places=2, max_digits=15, null=True),
        ),
    ]
