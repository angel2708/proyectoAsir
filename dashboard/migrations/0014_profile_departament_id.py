# Generated by Django 3.1.2 on 2021-01-12 18:56

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard', '0013_departament'),
    ]

    operations = [
        migrations.AddField(
            model_name='profile',
            name='departament_id',
            field=models.IntegerField(default=0),
        ),
    ]
