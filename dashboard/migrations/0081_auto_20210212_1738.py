# Generated by Django 3.1.2 on 2021-02-12 16:38

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard', '0080_auto_20210212_1133'),
    ]

    operations = [
        migrations.AlterField(
            model_name='contacts',
            name='web',
            field=models.CharField(blank=True, max_length=500),
        ),
    ]
