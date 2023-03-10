# Generated by Django 3.1.2 on 2021-02-03 11:58

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard', '0056_remove_visit_billing'),
    ]

    operations = [
        migrations.AlterField(
            model_name='visit',
            name='commercial_request',
            field=models.BooleanField(null=True),
        ),
        migrations.AlterField(
            model_name='visit',
            name='concerted_visit',
            field=models.BooleanField(null=True),
        ),
        migrations.AlterField(
            model_name='visit',
            name='contact_id',
            field=models.IntegerField(null=True),
        ),
        migrations.AlterField(
            model_name='visit',
            name='has_showcase',
            field=models.BooleanField(null=True),
        ),
        migrations.AlterField(
            model_name='visit',
            name='hour',
            field=models.IntegerField(null=True),
        ),
        migrations.AlterField(
            model_name='visit',
            name='internal_observations',
            field=models.CharField(blank=True, max_length=500),
        ),
        migrations.AlterField(
            model_name='visit',
            name='manager_check',
            field=models.BooleanField(null=True),
        ),
        migrations.AlterField(
            model_name='visit',
            name='observations',
            field=models.CharField(blank=True, max_length=500),
        ),
        migrations.AlterField(
            model_name='visit',
            name='offert',
            field=models.CharField(blank=True, max_length=500),
        ),
        migrations.AlterField(
            model_name='visit',
            name='public_sale',
            field=models.BooleanField(null=True),
        ),
        migrations.AlterField(
            model_name='visit',
            name='regular_suppliers',
            field=models.CharField(blank=True, max_length=500),
        ),
        migrations.AlterField(
            model_name='visit',
            name='shopping_center',
            field=models.CharField(blank=True, max_length=100),
        ),
        migrations.AlterField(
            model_name='visit',
            name='showcase_description',
            field=models.CharField(blank=True, max_length=500),
        ),
        migrations.AlterField(
            model_name='visit',
            name='stock',
            field=models.CharField(blank=True, max_length=100),
        ),
        migrations.AlterField(
            model_name='visit',
            name='user_check',
            field=models.BooleanField(null=True),
        ),
        migrations.AlterField(
            model_name='visit',
            name='workshop',
            field=models.BooleanField(null=True),
        ),
    ]
