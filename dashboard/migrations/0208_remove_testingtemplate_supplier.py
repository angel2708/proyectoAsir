# Generated by Django 3.2.4 on 2021-07-01 15:03

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard', '0207_tracking_user_id'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='testingtemplate',
            name='supplier',
        ),
    ]
