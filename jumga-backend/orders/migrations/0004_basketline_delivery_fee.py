# Generated by Django 3.1.5 on 2021-01-13 14:52

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('orders', '0003_auto_20210113_1446'),
    ]

    operations = [
        migrations.AddField(
            model_name='basketline',
            name='delivery_fee',
            field=models.DecimalField(blank=True, decimal_places=2, max_digits=10, null=True),
        ),
    ]
