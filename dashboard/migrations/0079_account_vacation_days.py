# Generated by Django 3.1.2 on 2021-02-09 17:58

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard', '0078_auto_20210209_1305'),
    ]

    operations = [
        migrations.AddField(
            model_name='account',
            name='vacation_days',
            field=models.IntegerField(default=0),
        ),
    ]
