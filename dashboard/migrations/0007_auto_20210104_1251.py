# Generated by Django 3.1.2 on 2021-01-04 11:51

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard', '0006_auto_20210104_1226'),
    ]

    operations = [
        migrations.RenameModel(
            old_name='Functions',
            new_name='Function',
        ),
        migrations.RenameModel(
            old_name='Permissions',
            new_name='Permission',
        ),
        migrations.RenameModel(
            old_name='Profiles',
            new_name='Profile',
        ),
    ]