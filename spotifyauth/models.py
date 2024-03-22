from django.db import models


class SpotifyToken(models.Model):
    user = models.CharField(max_length=50, unique=True)
    created_at = models.DateTimeField(auto_now_add=True, null=True)
    refresh_token = models.CharField(max_length=1300, null=True)
    access_token = models.CharField(max_length=1300, null=True)
    expires_in = models.DateTimeField(null=True)
    token_type = models.CharField(max_length=100,null=True)
