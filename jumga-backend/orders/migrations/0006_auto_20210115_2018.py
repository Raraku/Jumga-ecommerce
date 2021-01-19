# Generated by Django 3.1.5 on 2021-01-15 19:18

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('orders', '0005_auto_20210113_1602'),
    ]

    operations = [
        migrations.AlterField(
            model_name='orderline',
            name='status',
            field=models.IntegerField(choices=[(10, 'New'), (20, 'Processing'), (30, 'Delivered'), (40, 'Cancelled')], default=10),
        ),
    ]
