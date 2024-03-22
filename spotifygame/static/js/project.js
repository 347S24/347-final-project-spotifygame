// Define the authenticateSpotify function
function authenticateSpotify() {
  fetch("/spotifyauth/is-authenticated")
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      if (!data.status) {
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
