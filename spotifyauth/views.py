from django.shortcuts import render, redirect
from .credentials import REDIRECT_URI, CLIENT_SECRET, CLIENT_ID
from rest_framework.views import APIView
from requests import Request, post
from rest_framework import status
from rest_framework.response import Response
from .util import *
import random
from random import randint
from django.urls import reverse
from django.contrib.auth import authenticate, login
from django.contrib.auth.forms import AuthenticationForm
from .models import UserProfile
# from .forms import UserProfileForm


class AuthURL(APIView):
    def get(self, request, format=None):
        scopes = 'user-library-read user-read-playback-state user-modify-playback-state user-read-currently-playing'

        url = Request('GET', 'https://accounts.spotify.com/authorize', params={
            'scope': scopes,
            'response_type': 'code',
            'redirect_uri': REDIRECT_URI,
            'client_id': CLIENT_ID,
         #   'show_dialog': 'true'
        }).prepare().url

        return Response({'url': url}, status=status.HTTP_200_OK)


def spotify_callback(request, format=None):
    code = request.GET.get('code')
    error = request.GET.get('error')

    response = post('https://accounts.spotify.com/api/token', data={
        'grant_type': 'authorization_code',
        'code': code,
        'redirect_uri': REDIRECT_URI,
        'client_id': CLIENT_ID,
        'client_secret': CLIENT_SECRET
    }).json()

    access_token = response.get('access_token')
    token_type = response.get('token_type')
    refresh_token = response.get('refresh_token')
    expires_in = response.get('expires_in')
    error = response.get('error')

    if not request.session.exists(request.session.session_key):
        request.session.create()

    update_or_create_user_tokens(
        request.session.session_key, access_token, token_type, expires_in, refresh_token)

    return redirect('gameselect/') #change this to redirect to the game page

class IsAuthenticated(APIView):
    def get(self, request, format=None):
        is_authenticated = is_spotify_authenticated(
            self.request.session.session_key)

        return Response({'status': is_authenticated}, status=status.HTTP_200_OK)


class SkipToNextSong(APIView):
    @staticmethod
    def get_total_liked_tracks(session_id):
        # Make a request to the Spotify API to get the total number of liked tracks
        endpoint = "tracks?limit=1"  # Fetch only one track to get the total count
        # error here?
        response = execute_spotify_api_request(session_id, endpoint)

        # Check if the response contains the total count information
        if 'total' in response:
            return response['total']
        else:
            # Handle the case where total count is not available in the response
            return 0  # Return 0 as default

    def get(self, request, format=None):
        # Get the total number of liked tracks
        # error here?
        total_tracks = self.get_total_liked_tracks(request.COOKIES.get('sessionid'))

        if total_tracks == 0:
        # Return a response indicating that the user has no liked tracks
            return Response({'message': 'You have no liked tracks.'}, status=status.HTTP_204_NO_CONTENT)

        # Generate a random offset within the range of total liked tracks
        offset = randint(0, total_tracks - 1)
        limit = total_tracks

        if limit > 50:
            limit = 50

        # Construct the endpoint with the random offset
        endpoint = f"tracks?offset={offset}&limit={limit}" #access to currently playing song on users spotify account
        #must include token to request

#check the sessionid again
        response = execute_spotify_api_request(request.COOKIES.get('sessionid'), endpoint)

        if 'error' in response or 'items' not in response:
            return Response({}, status=status.HTTP_204_NO_CONNECTION)

        items = response.get('items', [])
        songs = []

        for item in items:
            track = item.get('track', {})
            duration = track.get('duration_ms')
            album_cover = track.get('album', {}).get('images')

            if album_cover:
                album_cover = album_cover[0].get('url')
            else:
                continue

            song_id = track.get('id')
            uri = track.get('uri')
            preview_url = track.get('preview_url')

              # If preview_url is None, skip this track and continue to the next one
            if preview_url is None:
                continue

            artist_string = ""

            for i, artist in enumerate(track.get('artists', [])):
                if i > 0:
                    artist_string += ", "
                name = artist.get('name')
                artist_string += name

            song = {
                'title': track.get('name'),
                'artist': artist_string,
                'album': track.get('album').get('name'),
                'duration': duration,
                'image_url': album_cover,
                'preview_url': track.get('preview_url'),
                'id': song_id,
                'uri': uri
            }
            songs.append(song)
        if not songs:
            return Response({}, status=status.HTTP_204_NO_CONTENT)

        random_song = random.choice(songs)
        print(random_song)
        return Response({'random_song': random_song}, status=status.HTTP_200_OK)


# Views for logins
def login_view(request):
    if request.method == 'POST':
        form = AuthenticationForm(request, data=request.POST)
        if form.is_valid():
            username = form.cleaned_data.get('username')
            password = form.cleaned_data.get('password')
            user = authenticate(username=username, password=password)
            if user is not None:
                login(request, user)
                return redirect('profile')
    else:
        form = AuthenticationForm()
    return render(request, 'login.html', {'form':form})

def profile(request):
    user_profile = UserProfile.objects.get(user=request.user)
    return render(request, 'profile.html', {'user_profile': user_profile})

# def create_profile(request):
#     if request.method == 'POST':
#         form = UserProfileForm(request.POST)
#         if form.is_valid():
#             user_profile = form.save(commit=False)
#             user_profile.user = request.user
#             user_profile.save()
#             return redirect('profile')
#     else:
#         form = UserProfileForm()
#     return render(request, 'create_profile.html', {'form': form})
