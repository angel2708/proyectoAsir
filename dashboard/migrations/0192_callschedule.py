# Generated by Django 3.1.2 on 2021-06-02 16:34

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard', '0191_auto_20210527_1355'),
    ]

    operations = [
        migrations.CreateModel(
            name='CallSchedule',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('phone', models.CharField(blank=True, max_length=100, null=True)),
                ('contact_id', models.IntegerField()),
                ('dt', models.DateTimeField()),
            ],
        ),
    ]