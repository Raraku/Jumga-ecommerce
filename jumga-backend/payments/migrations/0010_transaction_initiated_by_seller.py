# Generated by Django 3.1.5 on 2021-01-18 08:49

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0005_sellershop_subaccount_id'),
        ('payments', '0009_auto_20210115_2058'),
    ]

    operations = [
        migrations.AddField(
            model_name='transaction',
            name='initiated_by_seller',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='seller', to='accounts.sellershop'),
        ),
    ]