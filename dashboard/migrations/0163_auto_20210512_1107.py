# Generated by Django 3.1.7 on 2021-05-12 09:07

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard', '0162_auto_20210512_1046'),
    ]

    operations = [
        migrations.AlterField(
            model_name='commercialbudgets',
            name='reference',
            field=models.CharField(max_length=80),
        ),
        migrations.AlterField(
            model_name='commercialbudgets',
            name='title',
            field=models.CharField(max_length=100),
        ),
    ]