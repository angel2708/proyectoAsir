# Generated by Django 3.2.4 on 2021-09-20 14:54

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard', '0250_alter_carrierincidence_shipment_number'),
    ]

    operations = [
        migrations.AlterField(
            model_name='tracking',
            name='order_id',
            field=models.CharField(max_length=200),
        ),
    ]
