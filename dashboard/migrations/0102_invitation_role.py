# Generated by Django 3.1.2 on 2021-02-25 16:57

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard', '0101_invitation_verification_url'),
    ]

    operations = [
        migrations.AddField(
            model_name='invitation',
            name='role',
            field=models.IntegerField(default=0),
        ),
    ]