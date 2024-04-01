from django.shortcuts import render, redirect
from .credentials import REDIRECT_URI, CLIENT_SECRET, CLIENT_ID
from rest_framework.views import APIView
from requests import Request, post
from rest_framework import status
from rest_framework.response import Response
from .util import *
import random


class AuthURL(APIView):
    def get(self, request, format=None):
        scopes = 'user-library-read user-read-playback-state user-modify-playback-state user-read-currently-playing'

        url = Request('GET', 'https://accounts.spotify.com/authorize', params={
            'scope': scopes,
            'response_type': 'code',
            'redirect_uri': REDIRECT_URI,
            'client_id': CLIENT_ID
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

    return redirect('spotifyauth:') #temporary

class IsAuthenticated(APIView):
    def get(self, request, format=None):
        is_authenticated = is_spotify_authenticated(
            self.request.session.session_key)
        return Response({'status': is_authenticated}, status=status.HTTP_200_OK)


# We dont want the current song though, I think we want to access user's liked songs, 
# then randomly play a song from their likes 

class UserSavedTracks(APIView):
    def get(self, request, format=None):
        #get the information of the user 
        #change endpoint to specific api endpoint
        # change offset to 50 to access the next 50 tracks, 100 after CAN MAKE IT VARIABLE bc offset is where the 1st track returned is
        endpoint = "tracks?&offset=0&limit=50" #access to currently playing song on users spotify account
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
            album_cover = track.get('album', {}).get('images', [])[0].get('url')
            song_id = track.get('id')
            uri = track.get('uri')

            artist_string = ""

            for i, artist in enumerate(track.get('artists', [])):
                if i > 0:
                    artist_string += ", "
                name = artist.get('name')
                artist_string += name

            song = {
                'title': track.get('name'),
                'artist': artist_string,
                'duration': duration,
                'image_url': album_cover,
                'id': song_id,
                'uri': uri
            }
            songs.append(song)
        if not songs:
            return Response({}, status=status.HTTP_204_NO_CONTENT)

        random_song = random.choice(songs)
        return Response(random_song, status=status.HTTP_200_OK)

        # I have a list of user's liked songs now. I want to randomly choose one
        #return Response(songs, status=status.HTTP_200_OK)

