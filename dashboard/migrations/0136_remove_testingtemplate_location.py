# Generated by Django 3.1.2 on 2021-04-12 00:15

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard', '0135_auto_20210409_1935'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='testingtemplate',
            name='location',
        ),
    ]