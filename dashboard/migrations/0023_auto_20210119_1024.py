# Generated by Django 3.1.2 on 2021-01-19 09:24

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard', '0022_auto_20210119_1010'),
    ]

    operations = [
        migrations.AddField(
            model_name='contacts',
            name='fax',
            field=models.CharField(blank=True, max_length=200),
        ),
        migrations.AlterField(
            model_name='contacts',
            name='mail',
            field=models.CharField(blank=True, max_length=200),
        ),
        migrations.AlterField(
            model_name='contacts',
            name='tel',
            field=models.CharField(blank=True, max_length=200),
        ),
        migrations.AlterField(
            model_name='contacts',
            name='web',
            field=models.CharField(blank=True, max_length=100),
        ),
    ]