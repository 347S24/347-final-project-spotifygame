async function authenticateSpotify() {
  // Check if Spotify is already authenticated
  let response = await fetch("/spotifyauth/is-authenticated");
  response = await response.json();
  if (response.status) {
    window.location.href = "/spotifyauth/gameselect";
    return;
  }

  response = await fetch("/spotifyauth/get-auth-url");
  response = await response.json();
  window.location.replace(response.url);
}


// Add event listener when DOM content is loaded
document.addEventListener('DOMContentLoaded', function () {
  // Add event listener for click on the login button
  document.getElementById('spotify-login').addEventListener('click', authenticateSpotify);
});
