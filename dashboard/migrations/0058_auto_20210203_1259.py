# Generated by Django 3.1.2 on 2021-02-03 11:59

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard', '0057_auto_20210203_1258'),
    ]

    operations = [
        migrations.AlterField(
            model_name='visit',
            name='internal_observations',
            field=models.CharField(blank=True, max_length=500, null=True),
        ),
        migrations.AlterField(
            model_name='visit',
            name='observations',
            field=models.CharField(blank=True, max_length=500, null=True),
        ),
        migrations.AlterField(
            model_name='visit',
            name='offert',
            field=models.CharField(blank=True, max_length=500, null=True),
        ),
        migrations.AlterField(
            model_name='visit',
            name='regular_suppliers',
            field=models.CharField(blank=True, max_length=500, null=True),
        ),
        migrations.AlterField(
            model_name='visit',
            name='shopping_center',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
        migrations.AlterField(
            model_name='visit',
            name='showcase_description',
            field=models.CharField(blank=True, max_length=500, null=True),
        ),
        migrations.AlterField(
            model_name='visit',
            name='stock',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
        migrations.AlterField(
            model_name='visit',
            name='volume',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
    ]