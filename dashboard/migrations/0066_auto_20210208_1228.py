# Generated by Django 3.1.2 on 2021-02-08 11:28

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard', '0065_auto_20210208_0139'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='contacts',
            name='web_password',
        ),
        migrations.AddField(
            model_name='ivaregime',
            name='id_ADN',
            field=models.CharField(blank=True, max_length=50),
        ),
        migrations.AddField(
            model_name='paymentmethod',
            name='id_ADN',
            field=models.CharField(blank=True, max_length=50),
        ),
        migrations.AddField(
            model_name='tariff',
            name='id_ADN',
            field=models.CharField(blank=True, max_length=50),
        ),
    ]
