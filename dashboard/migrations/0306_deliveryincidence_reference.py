# Generated by Django 3.2.4 on 2022-11-18 17:14

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard', '0305_account_vacation_days_next'),
    ]

    operations = [
        migrations.AddField(
            model_name='deliveryincidence',
            name='reference',
            field=models.CharField(max_length=50, null=True),
        ),
    ]