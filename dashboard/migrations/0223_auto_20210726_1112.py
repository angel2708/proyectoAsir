# Generated by Django 3.1.2 on 2021-07-26 09:12

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard', '0222_satentry_tariff'),
    ]

    operations = [
        migrations.AlterField(
            model_name='satentry',
            name='tariff',
            field=models.CharField(blank=True, default='', max_length=20),
        ),
    ]
