# Generated by Django 3.1.2 on 2021-08-30 09:51

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard', '0245_supplier_contact'),
    ]

    operations = [
        migrations.CreateModel(
            name='SupplierContact',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('company_id', models.PositiveIntegerField(default=0)),
                ('contact', models.CharField(max_length=100, null=True)),
                ('name', models.CharField(max_length=200)),
                ('mail', models.TextField(blank=True, null=True)),
                ('tel', models.TextField(blank=True, null=True)),
                ('address', models.TextField(blank=True, null=True)),
                ('country', models.TextField(blank=True, null=True)),
                ('cif', models.CharField(blank=True, max_length=50)),
                ('cod_adn', models.CharField(blank=True, max_length=50)),
                ('removed', models.BooleanField(default=False)),
                ('created_at', models.DateTimeField(auto_now_add=True, null=True)),
                ('updated_at', models.DateTimeField(auto_now=True, null=True)),
            ],
        ),
    ]
