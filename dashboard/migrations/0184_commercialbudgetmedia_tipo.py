# Generated by Django 3.1.2 on 2021-05-23 11:05

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard', '0183_auto_20210523_1014'),
    ]

    operations = [
        migrations.AddField(
            model_name='commercialbudgetmedia',
            name='tipo',
            field=models.IntegerField(default=0),
            preserve_default=False,
        ),
    ]
