# Generated by Django 3.1.2 on 2021-01-20 16:18

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard', '0032_supplier'),
    ]

    operations = [
        migrations.CreateModel(
            name='IVAType',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('code', models.CharField(blank=True, max_length=50)),
            ],
        ),
        migrations.RemoveField(
            model_name='ivaregime',
            name='company_id',
        ),
        migrations.AddField(
            model_name='ivaregime',
            name='code',
            field=models.CharField(blank=True, max_length=50),
        ),
        migrations.AddField(
            model_name='paymentmethod',
            name='expiration_days',
            field=models.IntegerField(null=True),
        ),
        migrations.AddField(
            model_name='paymentmethod',
            name='expirations_quantity',
            field=models.IntegerField(null=True),
        ),
    ]
