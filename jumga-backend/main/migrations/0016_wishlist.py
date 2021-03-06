# Generated by Django 3.1.5 on 2021-01-19 06:49

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0008_sellershop_paid_reg_fee'),
        ('main', '0015_auto_20210118_2321'),
    ]

    operations = [
        migrations.CreateModel(
            name='Wishlist',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('owner', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='accounts.customer')),
                ('products', models.ManyToManyField(blank=True, to='main.Product')),
            ],
        ),
    ]
