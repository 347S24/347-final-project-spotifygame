// Define the authenticateSpotify function
function authenticateSpotify() {
  // Check if Spotify is already authenticated
  fetch("/spotifyauth/is-authenticated")
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      // If Spotify is already authenticated, redirect to the game page
      if (data.status) {
        window.location.href = "/spotifyauth/game";
      } else {
        // If not authenticated, get authentication URL and redirect to it
        fetch("/spotifyauth/get-auth-url")
          .then(function(response) {
            return response.json();
          })
          .then(function(data) {
            window.location.replace(data.url);
          });
      }
    });
}

// Add event listener when DOM content is loaded
document.addEventListener('DOMContentLoaded', function () {
  // Add event listener for click on the login button
  document.getElementById('spotify-login').addEventListener('click', authenticateSpotify);
});
