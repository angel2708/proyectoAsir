# Generated by Django 3.1.2 on 2021-01-14 17:24

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard', '0017_account_departament_id'),
    ]

    operations = [
        migrations.AddField(
            model_name='departament',
            name='manager',
            field=models.IntegerField(default=0),
        ),
    ]
