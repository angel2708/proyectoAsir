# Generated by Django 3.2.4 on 2021-07-27 09:17

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard', '0224_satmedia'),
    ]

    operations = [
        migrations.AddField(
            model_name='contacts',
            name='processed_by_script',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='note',
            name='created_by_script',
            field=models.BooleanField(default=False),
        ),
    ]