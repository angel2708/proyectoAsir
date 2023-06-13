# Generated by Django 3.2.4 on 2021-10-06 14:52

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard', '0253_auto_20210927_1338'),
    ]

    operations = [
        migrations.CreateModel(
            name='WebSearch',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('input', models.CharField(max_length=300)),
                ('client', models.CharField(max_length=100)),
                ('status', models.IntegerField()),
                ('local', models.BooleanField()),
                ('search_id', models.IntegerField()),
            ],
        ),
        migrations.CreateModel(
            name='WebSearchClick',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('search_id', models.IntegerField()),
                ('article_id', models.IntegerField()),
            ],
        ),
    ]