# Generated by Django 3.1.5 on 2021-01-17 21:17

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0005_sellershop_subaccount_id'),
        ('main', '0006_auto_20210117_2215'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='productreview',
            name='helpful',
        ),
        migrations.AddField(
            model_name='productreview',
            name='helpful',
            field=models.ManyToManyField(blank=True, null=True, to='accounts.Customer'),
        ),
    ]
