# Generated by Django 3.1.5 on 2021-01-13 15:09

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('payments', '0002_auto_20210113_1212'),
    ]

    operations = [
        migrations.AddField(
            model_name='jumgacommision',
            name='type',
            field=models.CharField(choices=[('purchase', 'purchase'), ('dispatch', 'dispatch')], default='purchase', max_length=20),
        ),
    ]
