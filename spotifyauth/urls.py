from django.urls import path
from .views import *
from django.views.generic import TemplateView

app_name = 'spotifyauth'

urlpatterns = [
    path('', TemplateView.as_view(template_name="pages/home.html"),
        name='home'
    ),
    path('get-auth-url', AuthURL.as_view()),
    path('redirect', spotify_callback),
    path('is-authenticated', IsAuthenticated.as_view()),
    path('saved-tracks', UserSavedTracks.as_view())
]
