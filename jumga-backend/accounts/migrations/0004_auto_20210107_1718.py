# Generated by Django 3.1.4 on 2021-01-07 16:18

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0003_sellershop'),
    ]

    operations = [
        migrations.AlterField(
            model_name='sellershop',
            name='slug',
            field=models.SlugField(blank=True, null=True),
        ),
    ]
