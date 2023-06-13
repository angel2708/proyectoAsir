# Generated by Django 3.1.2 on 2021-04-06 14:49

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard', '0127_auto_20210329_1136'),
    ]

    operations = [
        migrations.CreateModel(
            name='PartTesting',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('report_id', models.IntegerField()),
                ('serial_number', models.CharField(max_length=200)),
                ('weight', models.CharField(max_length=200)),
                ('meassures', models.CharField(max_length=200)),
                ('lumens', models.CharField(max_length=200)),
                ('candles', models.CharField(max_length=200)),
                ('image', models.CharField(max_length=200)),
                ('errors', models.TextField()),
                ('correct', models.BooleanField()),
            ],
        ),
        migrations.CreateModel(
            name='PhoneTesting',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('report_id', models.IntegerField()),
                ('category', models.CharField(max_length=50)),
                ('image', models.CharField(max_length=200)),
                ('errors', models.TextField()),
                ('serial_number', models.CharField(max_length=200)),
                ('lcd', models.BooleanField()),
                ('touch', models.BooleanField()),
                ('front_camera', models.BooleanField()),
                ('camera', models.BooleanField()),
                ('touch_face_id', models.BooleanField()),
                ('sim_reader', models.BooleanField()),
                ('wifi', models.BooleanField()),
                ('bluetooth', models.BooleanField()),
                ('ear_speaker', models.BooleanField()),
                ('microphone', models.BooleanField()),
                ('speakers', models.BooleanField()),
                ('battery', models.BooleanField()),
                ('imei', models.BooleanField()),
                ('aesthetics', models.BooleanField()),
                ('charge', models.BooleanField()),
                ('sensors', models.BooleanField()),
                ('buttons', models.BooleanField()),
                ('thouch_3d', models.BooleanField()),
                ('true_tone', models.BooleanField()),
                ('capacity', models.BooleanField()),
                ('sim_restrictions', models.BooleanField()),
            ],
        ),
        migrations.CreateModel(
            name='TestingReport',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('company_id', models.IntegerField()),
                ('template_id', models.IntegerField()),
                ('document', models.CharField(max_length=200)),
                ('quantity', models.IntegerField()),
                ('test_type', models.IntegerField()),
                ('rma_percentage', models.FloatField()),
            ],
        ),
        migrations.CreateModel(
            name='TestingTemplate',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('company_id', models.IntegerField()),
                ('reference', models.CharField(max_length=200)),
                ('description', models.CharField(max_length=200)),
                ('location', models.CharField(max_length=200)),
                ('weight', models.CharField(max_length=200)),
                ('meassures', models.CharField(max_length=200)),
                ('lumens', models.CharField(max_length=200)),
                ('candles', models.CharField(max_length=200)),
            ],
        ),
        migrations.AddField(
            model_name='card',
            name='order_id',
            field=models.IntegerField(null=True),
        ),
        migrations.AddField(
            model_name='list',
            name='order_id',
            field=models.IntegerField(null=True),
        ),
    ]
