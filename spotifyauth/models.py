from django.db import models
from django.contrib.auth.models import User

from config.settings.base import AUTH_USER_MODEL



class SpotifyToken(models.Model):
    user = models.CharField(max_length=50, unique=True)
    created_at = models.DateTimeField(auto_now_add=True, null=True)
    refresh_token = models.CharField(max_length=1300, null=True)
    access_token = models.CharField(max_length=1300, null=True)
    expires_in = models.DateTimeField(null=True)
    token_type = models.CharField(max_length=100,null=True)

class UserProfile(models.Model):
    # one to one realtionship with User model (built in)
    # links each UserProgile to single user instance
    # if one is deleted corresponding deleted (CASCADE)
    user = models.OneToOneField(AUTH_USER_MODEL, on_delete=models.CASCADE)

    # will need to link up with game
    high_score = models.IntegerField(default=0)

    # boolean if spotify is linked
    spotify_linked = models.BooleanField(default=False)

    # user profile can still have a profile even if no spotify token assocaited with it
    spotify_token = models.ForeignKey(SpotifyToken, on_delete=models.SET_NULL, null=True)

