# Generated by Django 3.1.2 on 2021-01-20 15:47

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard', '0031_brand'),
    ]

    operations = [
        migrations.CreateModel(
            name='Supplier',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('company_id', models.IntegerField(null=True)),
                ('name', models.CharField(max_length=100)),
            ],
        ),
    ]
