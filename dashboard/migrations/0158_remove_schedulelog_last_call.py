# Generated by Django 3.1.2 on 2021-05-10 15:17

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard', '0157_schedulelog'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='schedulelog',
            name='last_call',
        ),
    ]