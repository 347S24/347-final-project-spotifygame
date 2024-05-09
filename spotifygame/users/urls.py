from django.urls import path

from spotifygame.users.views import (
    user_redirect_view,
    user_update_view,
    user_detail_view,
    check_authentication,
    update_streak
)

app_name = "users"
urlpatterns = [
    path("~redirect/", view=user_redirect_view, name="redirect"),
    path("~update/", view=user_update_view, name="update"),
    path("<str:username>/", view=user_detail_view, name="detail"),
    path('check-authentication/', check_authentication, name='check_authentication'),
    path('update-streak/', update_streak, name='update_streak'),
]
