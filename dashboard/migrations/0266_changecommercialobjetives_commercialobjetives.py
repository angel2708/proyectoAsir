# Generated by Django 3.2.7 on 2021-11-30 08:54

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard', '0265_commercialbudgets_internal_comment'),
    ]

    operations = [
        migrations.CreateModel(
            name='ChangeCommercialObjetives',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('company_id', models.IntegerField()),
                ('objetive_id', models.IntegerField()),
                ('prev_amount', models.IntegerField()),
                ('new_amount', models.IntegerField()),
                ('user', models.IntegerField()),
                ('created_at', models.DateTimeField(auto_now_add=True, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='CommercialObjetives',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('company_id', models.IntegerField()),
                ('name', models.CharField(max_length=50, null=True)),
                ('objetive', models.CharField(max_length=50, null=True)),
                ('created_at', models.DateTimeField(auto_now_add=True, null=True)),
            ],
        ),
    ]
