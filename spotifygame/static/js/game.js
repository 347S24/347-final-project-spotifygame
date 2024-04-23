function nextButton() {
    location.reload();
}

function normalizeString(str) {
    // Convert to lowercase and remove spaces
    return str.toLowerCase().trim();
}

class Game {
  constructor(mode) {
    this.mode = mode;
    this.streak = 0
    this.guessesLeft = 10;
    this.correctGuesses = 0;
    this.startTime = Date.now();
    this.updateScoreDisplay();
  }

  adjustScore(guessCorrect) {
    switch (this.mode) {
      case "streak":
        this.streak = guessCorrect ? this.streak + 1 : 0;
        break;
      case "timed":
        this.correct_guesses = guessCorrect ? this.correct_guesses + 1 : this.correct_guesses;
        break;
      case "bo10":
        this.correct_guesses = guessCorrect ? this.correct_guesses + 1 : this.correct_guesses;
        this.guessesLeft -= 1;
        break;
    }
  }

  submitGuess = () => {
    console.log(this);
    let guess = document.getElementById("guess").value;
    let songTitle = document.getElementById("song-title").value;
    
    let guessCorrect = false;
    if (normalizeString(guess) === normalizeString(songTitle)) {
      displayCorrect();
      this.guessCorrect = true;
    } else {
      displayIncorrect();
    }
    this.adjustScore(guessCorrect);
    this.updateScoreDisplay();
  }

  
  updateScoreDisplay() {
    let scoreText = document.getElementById("score");
    let newText = "";
    switch (this.mode) {
      case "streak":
        newText = `Streak: ${this.streak}`
        break;
      case "timed":
        newText = `Time Left: ${Date.now() - this.startTime}`;
        break;
      case "bo10":
        newText = `Guesses Left: ${this.guessesLeft} Score: ${this.correctGuesses}/10`
        break;
    }
    scoreText.textContent = newText;
  }
}

const clearGuessDiv = (div) => {
  while (div.firstChild) {
    div.removeChild(div.firstChild);
  }
}

const displayIncorrect = () => {
  console.log("Incorrect guess");
}


const displayCorrect = () => {
  let guessDiv = document.getElementById("guess-div");
  clearDiv(guessDiv);

  let songPlayer = document.getElementById("song-player");
  songPlayer.play();
  
  let songPrev = document.getElementById("song-preview");
  songPrev.style.display = "none";

  let correctDiv = document.createElement("div");
  correctDiv.innerText = "Correct!";
  correctDiv.id = "correct-div";
  guessDiv.appendChild(correctDiv);

  let nextButton = document.getElementById("next-button");
  nextButton.style.display = "initial";
  guessDiv.appendChild(nextButton);
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
    
    // Parse gamemode from URL
    const urlParams = new URLSearchParams(window.location.search);
    const gamemode = urlParams.get('mode');
    
    const game = new Game(gamemode); 
    
    // Add event listener for click on the login button
    document.getElementById('spotify-logout').addEventListener('click', logoutFromSpotify);
    document.getElementById("submit-button").addEventListener("click", game.submitGuess);
    document.getElementById("hint-button").addEventListener("click", hintButton);
    document.getElementById("next-button").addEventListener("click", nextButton);
    document.getElementById("skip-button").addEventListener("click", nextButton);
});
