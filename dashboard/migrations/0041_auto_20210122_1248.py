# Generated by Django 3.1.2 on 2021-01-22 11:48

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard', '0040_address_email'),
    ]

    operations = [
        migrations.AlterField(
            model_name='contacts',
            name='mail',
            field=models.CharField(blank=True, max_length=350),
        ),
        migrations.AlterField(
            model_name='contacts',
            name='tel',
            field=models.CharField(blank=True, max_length=100),
        ),
    ]