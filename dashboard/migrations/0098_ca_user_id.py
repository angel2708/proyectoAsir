# Generated by Django 3.1.2 on 2021-02-24 09:13

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard', '0097_auto_20210224_1007'),
    ]

    operations = [
        migrations.AddField(
            model_name='ca',
            name='user_id',
            field=models.IntegerField(default=0),
        ),
    ]
