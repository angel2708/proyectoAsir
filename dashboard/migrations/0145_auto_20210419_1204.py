# Generated by Django 3.1.2 on 2021-04-19 10:04

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard', '0144_auto_20210419_1106'),
    ]

    operations = [
        migrations.AddField(
            model_name='parttesting',
            name='has_media',
            field=models.BooleanField(null=True),
        ),
        migrations.AddField(
            model_name='phonetesting',
            name='has_media',
            field=models.BooleanField(null=True),
        ),
    ]
