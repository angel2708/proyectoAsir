# Generated by Django 3.2.4 on 2021-08-27 11:05

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard', '0240_tracking_deleted'),
    ]

    operations = [
        migrations.AddField(
            model_name='tracking',
            name='force_end',
            field=models.BooleanField(default=False),
        ),
    ]
