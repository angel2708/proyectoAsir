# Generated by Django 3.1.2 on 2021-07-30 14:34

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard', '0228_auto_20210730_1626'),
    ]

    operations = [
        migrations.AlterField(
            model_name='satentry',
            name='encrypted_id',
            field=models.TextField(null=True),
        ),
    ]