from django.contrib import admin
from .models import SpotifyToken
from .models import UserProfile

class SpotifyTokenAdmin(admin.ModelAdmin):
    list_display = ('user', 'created_at', 'refresh_token', 'access_token', 'expires_in', 'token_type')
    search_fields = ('user',)  # Add fields you want to be searchable

# Register your model with the admin site
admin.site.register(SpotifyToken, SpotifyTokenAdmin)

admin.site.register(UserProfile)
