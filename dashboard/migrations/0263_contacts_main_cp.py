# Generated by Django 3.2.4 on 2021-10-19 16:35

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard', '0262_auto_20211019_1150'),
    ]

    operations = [
        migrations.AddField(
            model_name='contacts',
            name='main_cp',
            field=models.CharField(default='', max_length=30, null=True),
        ),
    ]