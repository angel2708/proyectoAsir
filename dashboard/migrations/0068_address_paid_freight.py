# Generated by Django 3.1.2 on 2021-02-08 15:54

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard', '0067_paymentmethod_cod'),
    ]

    operations = [
        migrations.AddField(
            model_name='address',
            name='paid_freight',
            field=models.BooleanField(default=False),
        ),
    ]