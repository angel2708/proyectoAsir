# Generated by Django 3.1.2 on 2021-01-19 17:38

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard', '0025_auto_20210119_1250'),
    ]

    operations = [
        migrations.AddField(
            model_name='account',
            name='role',
            field=models.IntegerField(default=0),
        ),
    ]
