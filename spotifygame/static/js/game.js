document.getElementById("submit-button").addEventListener("click", function () {
    // Get the value from the input field
    var inputValue = document.getElementById("guess").value;
    // Do something with the value, for example, log it to the console
    console.log("Input value:", inputValue);
});

document.getElementById("hint-button").addEventListener("click", function () {
    var hintButton = document.getElementById("hint-button");
    var elem = document.createElement("<div id='currhint'> Hint goes here: </div>");
    hintButton.appendChild(elem);
});

console.log("hi");

// Define a function to open the Spotify logout URL in a popup window
function logoutFromSpotify() {
    // Define the logout URL provided by Spotify
    const logoutUrl = 'https://accounts.spotify.com/en/logout';

    // Open the logout URL in a popup window
    const popupWindow = window.open(logoutUrl, 'Spotify Logout', 'width=700,height=500,top=40,left=40');

    // Close the popup window after 2 seconds
    setTimeout(() => {
        popupWindow.close();
        // Redirect back to the home page
        window.location.href = '/'; // Adjust the URL if necessary
    }, 2000);
}


document.addEventListener('DOMContentLoaded', function () {
    // Add event listener for click on the login button
    document.getElementById('spotify-logout').addEventListener('click', logoutFromSpotify);
});