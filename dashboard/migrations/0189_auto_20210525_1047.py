# Generated by Django 3.1.2 on 2021-05-25 08:47

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard', '0188_auto_20210525_0935'),
    ]

    operations = [
        migrations.AlterField(
            model_name='contacts',
            name='NIF',
            field=models.CharField(blank=True, max_length=50),
        ),
    ]