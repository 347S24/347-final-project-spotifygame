from django.urls import path
from .views import *
from django.views.generic import TemplateView
from .views import logout_view


app_name = 'spotifyauth'

urlpatterns = [
    path('', TemplateView.as_view(template_name="pages/home.html"),
        name='home'
    ),
    path('get-auth-url', AuthURL.as_view(), name='get-auth-url'),
    path('redirect', spotify_callback),
    path('is-authenticated', IsAuthenticated.as_view()),
    path('game/', UserSavedTracks.as_view(), name='random_track'),
    path('logout/', logout_view, name='logout')
    

    
]
