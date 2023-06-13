# Generated by Django 3.1.2 on 2021-04-12 22:01

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard', '0140_auto_20210412_1929'),
    ]

    operations = [
        migrations.RenameField(
            model_name='commercialbudgets',
            old_name='availableDate',
            new_name='available_date',
        ),
        migrations.RenameField(
            model_name='commercialbudgets',
            old_name='commercialMail',
            new_name='commercial_mail',
        ),
        migrations.RenameField(
            model_name='commercialbudgets',
            old_name='commercialName',
            new_name='commercial_name',
        ),
        migrations.RenameField(
            model_name='commercialbudgets',
            old_name='consultedPrice',
            new_name='consulted_price',
        ),
        migrations.RenameField(
            model_name='commercialbudgets',
            old_name='customerBudget',
            new_name='customer_budget',
        ),
        migrations.RenameField(
            model_name='commercialbudgets',
            old_name='finalPrice',
            new_name='final_price',
        ),
        migrations.RenameField(
            model_name='commercialbudgets',
            old_name='quantityAvailable',
            new_name='quantity_available',
        ),
        migrations.RenameField(
            model_name='commercialbudgets',
            old_name='typeQuery',
            new_name='type_query',
        ),
        migrations.AlterField(
            model_name='parttesting',
            name='errors',
            field=models.TextField(null=True),
        ),
    ]
