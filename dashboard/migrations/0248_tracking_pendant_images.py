# Generated by Django 3.2.4 on 2021-09-03 11:10

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard', '0247_contacts_tariff_wr'),
    ]

    operations = [
        migrations.AddField(
            model_name='tracking',
            name='pendant_images',
            field=models.IntegerField(default=0),
        ),
    ]
