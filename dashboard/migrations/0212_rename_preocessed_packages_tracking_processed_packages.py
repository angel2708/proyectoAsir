# Generated by Django 3.2.4 on 2021-07-02 15:41

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard', '0211_auto_20210702_1736'),
    ]

    operations = [
        migrations.RenameField(
            model_name='tracking',
            old_name='preocessed_packages',
            new_name='processed_packages',
        ),
    ]