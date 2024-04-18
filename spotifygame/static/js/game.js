function nextButton() {
    location.reload();
}

function normalizeString(str) {
    // Convert to lowercase and remove spaces
    return str.toLowerCase().trim();
}

function submitButton() {
    // Get the value from the input field
    var guess = document.getElementById("guess").value;
    var songTitle = document.getElementById("song-title").value;
    
    // Compare the strings
    if (normalizeString(guess) === normalizeString(songTitle)) {
        var guessDiv = document.getElementById("guess-div");
        while (guessDiv.firstChild) {
            guessDiv.removeChild(guessDiv.firstChild);
        }
        
        var songPlayer = document.getElementById("song-player");
        songPlayer.play();
        
        var songPrev = document.getElementById("song-preview");
        songPrev.style.display = "none";

        var correctDiv = document.createElement("div");
        correctDiv.innerText = "Correct!";
        correctDiv.id = "correct-div";
        guessDiv.appendChild(correctDiv);

        var nextButton = document.getElementById("next-button");
        nextButton.style.display = "initial";
        guessDiv.appendChild(nextButton);

    } else {
        console.log("Incorrect guess.");
    }
}

function hintButton() {
    var hintButton = document.getElementById("hint-button");
    
    // no more hints
    if (document.getElementById("second-hint") != null) {
        hintButton.innerText = "You only get two hints!";
    } else if (document.getElementById("first-hint") != null) {
        var hintDiv = document.getElementById("hint-section");

        var secondHint = document.createElement("div");
        secondHint.id = "second-hint";
        var songAlbum = "The album is: " + document.getElementById("song-album").value;
        secondHint.textContent = songAlbum;

        hintDiv.appendChild(secondHint);
    } else {
        var hintDiv = document.createElement("div");
        hintDiv.id = "hint-section";
    
        var firstHint = document.createElement("div");
        firstHint.id = "first-hint";
        var songTitle = "The artist is: " + document.getElementById("song-artist").value;
        firstHint.textContent = songTitle;
    
        hintButton.innerText = "Get Another Hint";
        hintDiv.appendChild(firstHint);
        hintButton.parentNode.appendChild(hintDiv);
    }
}


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
    document.getElementById("submit-button").addEventListener("click", submitButton);
    document.getElementById("hint-button").addEventListener("click", hintButton);
    document.getElementById("next-button").addEventListener("click", nextButton);
    document.getElementById("skip-button").addEventListener("click", nextButton);
});