# Generated by Django 3.1.7 on 2021-05-19 08:18

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard', '0175_merge_20210518_1722'),
    ]

    operations = [
        migrations.AddField(
            model_name='commercialbudgets',
            name='shopping_observations',
            field=models.CharField(max_length=200, null=True),
        ),
    ]
