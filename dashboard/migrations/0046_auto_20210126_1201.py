# Generated by Django 3.1.2 on 2021-01-26 11:01

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard', '0045_auto_20210126_1143'),
    ]

    operations = [
        migrations.AlterField(
            model_name='note',
            name='color',
            field=models.IntegerField(),
        ),
    ]
