# Generated by Django 3.1.2 on 2021-01-04 09:44

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard', '0004_auto_20210104_0954'),
    ]

    operations = [
        migrations.DeleteModel(
            name='Functions',
        ),
        migrations.DeleteModel(
            name='Profiles',
        ),
        migrations.DeleteModel(
            name='Restrictions',
        ),
    ]