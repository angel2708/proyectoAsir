# Generated by Django 3.1.2 on 2021-03-10 10:35

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard', '0106_auto_20210310_1053'),
    ]

    operations = [
        migrations.AddField(
            model_name='purchasedocument',
            name='state',
            field=models.IntegerField(default=0),
        ),
    ]
