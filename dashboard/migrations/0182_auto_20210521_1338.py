# Generated by Django 3.1.2 on 2021-05-21 11:38

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard', '0181_auto_20210521_1337'),
    ]

    operations = [
        migrations.AlterField(
            model_name='note',
            name='created_at',
            field=models.DateTimeField(auto_now_add=True, null=True),
        ),
    ]
