# stores spotify credentials
import os

CLIENT_ID = "f888d92f5b7a4e99b279edaa65d4abe4"
CLIENT_SECRET = "86de7569e0274efbb7aecdc62019afd6"

URL = os.environ["SPOTIFY_REDIRECT_URL"]
print(URL)
REDIRECT_URI = f"http://{URL}/spotifyauth/redirect"
