# Generated by Django 3.1.5 on 2021-01-15 19:20

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('orders', '0006_auto_20210115_2018'),
        ('payments', '0007_auto_20210115_2018'),
    ]

    operations = [
        migrations.RenameModel(
            old_name='JumgaCommision',
            new_name='JumgaCommission',
        ),
    ]