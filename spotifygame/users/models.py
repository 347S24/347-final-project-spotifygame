from django.contrib.auth.models import AbstractUser
from django.db import models
from django.urls import reverse
from django.utils.translation import gettext_lazy as _


class User(AbstractUser):

    # First Name and Last Name Do Not Cover Name Patterns
    # Around the Globe.
    name = models.CharField(
        _("Name of User"), blank=True, max_length=255
    )

    points = models.IntegerField(default=0)

    highest_streak = models.IntegerField(default=0)
    highest_score = models.IntegerField(default=0)


    def get_absolute_url(self):
        return reverse(
            "users:detail", kwargs={"username": self.username}
        )

    def update_highest_streak(self, new_streak):
        if new_streak > self.highest_streak:
            self.highest_streak = new_streak
            self.save()

    def update_highest_score(self, new_score):
        if new_score > self.highest_score:
            self.highest_score = new_score
            self.save()


