# Generated by Django 3.1.2 on 2021-05-23 10:14

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard', '0182_auto_20210521_1338'),
    ]

    operations = [
        migrations.RenameField(
            model_name='commercialbudgets',
            old_name='final_price',
            new_name='last_cost',
        ),
    ]
