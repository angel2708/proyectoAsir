# Generated by Django 3.1.2 on 2021-03-10 09:53

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard', '0105_product'),
    ]

    operations = [
        migrations.CreateModel(
            name='PurchaseDocument',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('document_name', models.CharField(max_length=100)),
                ('user_id', models.IntegerField()),
                ('company_id', models.IntegerField()),
                ('deleted', models.BooleanField(default=False)),
            ],
        ),
        migrations.CreateModel(
            name='PurchaseDocumentContent',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('purchase_document_id', models.IntegerField()),
                ('reference', models.IntegerField()),
            ],
        ),
        migrations.RemoveField(
            model_name='product',
            name='product_id',
        ),
    ]