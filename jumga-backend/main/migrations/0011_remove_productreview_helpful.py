# Generated by Django 3.1.5 on 2021-01-17 23:14

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0010_auto_20210118_0004'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='productreview',
            name='helpful',
        ),
    ]
