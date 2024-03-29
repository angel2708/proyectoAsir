# Generated by Django 3.2.4 on 2023-02-01 15:39

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard', '0311_auto_20230130_0925'),
    ]

    operations = [
        migrations.CreateModel(
            name='CheckLocationTraceability',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('company_id', models.IntegerField(null=True)),
                ('reference', models.CharField(max_length=50, null=True)),
                ('user_id', models.IntegerField(null=True)),
                ('ub1', models.CharField(max_length=50, null=True)),
                ('ub1_check', models.IntegerField()),
                ('ub2', models.CharField(max_length=50, null=True)),
                ('ub2_check', models.IntegerField()),
                ('created_at', models.DateTimeField(auto_now_add=True, null=True)),
                ('updated_at', models.DateTimeField(auto_now=True, null=True)),
                ('ub_error', models.CharField(max_length=50, null=True)),
            ],
        ),
    ]
