# Generated by Django 3.1.1 on 2024-03-22 00:13

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('spotifyauth', '0002_spotifytoken_expires_in'),
    ]

    operations = [
        migrations.AlterField(
            model_name='spotifytoken',
            name='access_token',
            field=models.CharField(max_length=1000),
        ),
        migrations.AlterField(
            model_name='spotifytoken',
            name='refresh_token',
            field=models.CharField(max_length=1000),
        ),
    ]