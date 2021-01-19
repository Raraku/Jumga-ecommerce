# Generated by Django 3.1.4 on 2021-01-07 16:00

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('orders', '__first__'),
    ]

    operations = [
        migrations.CreateModel(
            name='Transaction',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('type', models.CharField(choices=[('purchase', 'purchase'), ('registration', 'registration'), ('withdrawal', 'withdrawal')], max_length=20)),
                ('successful', models.BooleanField(default=False)),
                ('reference_code', models.CharField(max_length=100)),
                ('flutterwave_reference', models.CharField(blank=True, max_length=100, null=True)),
                ('amount', models.DecimalField(decimal_places=2, default=0, max_digits=15)),
                ('date', models.DateTimeField(auto_now_add=True)),
                ('seller_profit', models.DecimalField(decimal_places=2, default=0, max_digits=15)),
                ('charge_type', models.CharField(choices=[('debit', 'debit'), ('credit', 'credit')], default='credit', max_length=10)),
                ('Order', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='orders.order')),
                ('initiated_by', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='initiator', to=settings.AUTH_USER_MODEL)),
                ('referred_by', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='JumgaCommision',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('amount', models.DecimalField(decimal_places=2, default=0, max_digits=15)),
                ('time', models.DateTimeField(auto_now_add=True)),
                ('transaction', models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, to='payments.transaction')),
            ],
        ),
        migrations.CreateModel(
            name='DispatchCommission',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('amount', models.DecimalField(decimal_places=2, default=0, max_digits=15)),
                ('time', models.DateTimeField(auto_now_add=True)),
                ('transaction', models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, to='payments.transaction')),
            ],
        ),
    ]