# Generated by Django 3.2.7 on 2022-03-11 07:36

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard', '0273_booking'),
    ]

    operations = [
        migrations.AddField(
            model_name='booking',
            name='title',
            field=models.CharField(default='', max_length=30),
        ),
    ]
