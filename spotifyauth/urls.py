from django.urls import path
from .views import *
from django.views.generic import TemplateView



app_name = 'spotifyauth'

urlpatterns = [
    path('', TemplateView.as_view(template_name="pages/home.html"),
        name='home'
    ),
    path('gameselect/', TemplateView.as_view(template_name="pages/gameselect.html"), name="game_select"),
    path('get-auth-url', AuthURL.as_view(), name='get-auth-url'),
    path('redirect', spotify_callback),
    path('is-authenticated', IsAuthenticated.as_view()),
    path('game/', UserSavedTracks.as_view(), name='random_track'),
]
