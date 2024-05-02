let isGameOver = false;
let countdownInterval = null;

function nextButton() {
    location.reload();
}

function normalizeString(str) {
    // Convert to lowercase and remove spaces
    return str.toLowerCase().trim();
}

function endGame() {
    isGameOver = true;

    let guessDiv = document.getElementById("guess-div");
    clearGuessDiv(guessDiv);

    let gameOverDiv = document.createElement("div");
    gameOverDiv.innerText = "Game Over!";
    guessDiv.appendChild(gameOverDiv);

    // Disable buttons and input fields
    document.getElementById("guess").style.display = "none";
    document.getElementById("submit-button").style.display = "none";
    document.getElementById("hint-button").style.display = "none";
    document.getElementById("skip-button").style.display = "none";

    // Optionally, provide a restart button
    let restartButton = document.createElement("button");
    restartButton.className = "green-button";
    restartButton.textContent = "Restart";
    restartButton.onclick = () => {
        isGameOver = false;
        location.reload();
    }
    guessDiv.appendChild(restartButton);
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
        if (isGameOver) {
            return;
        }
        switch (this.mode) {
            case "streak":
                this.streak = guessCorrect ? this.streak + 1 : 0;
                break;
            case "timed":
                this.correctGuesses = guessCorrect ? this.correctGuesses + 1 : this.correctGuesses;
                break;
            case "bo10":
                this.correctGuesses = guessCorrect ? this.correctGuesses + 1 : this.correctGuesses;
                if (!guessCorrect) {
                    this.guessesLeft -= 1;
                }
                if (this.guessesLeft === 0) {
                    endGame();
                } 
                break;
        }
    }

    submitGuess = () => {
        if (isGameOver) {
            return;
        }
        let guess = document.getElementById("guess").value;
        let songTitle = document.getElementById("song-title").value;

        let guessCorrect = false;
        if (normalizeString(guess) === normalizeString(songTitle)) {
            displayCorrect();
            guessCorrect = true;
            this.adjustScore(guessCorrect);
            this.updateScoreDisplay();
            fetchNextSong();
        } else {
            displayIncorrect();
        }
    }

    updateScoreDisplay() {
        if (isGameOver) {
            return;
        }
        let scoreText = document.getElementById("score");
        let newText = "";
        switch (this.mode) {
            case "streak":
                newText = `Streak: ${this.streak}`;
                break;
            case "timed":
                newText = `Time Left: 30`;
                break;
            case "bo10":
                newText = `Guesses Left: ${this.guessesLeft} Score: ${this.correctGuesses}/10`;
                break;
            default:
                newText = "broken"
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
    if (isGameOver) {
        return;
    }
    let guessDiv = document.getElementById("guess-div");
    clearGuessDiv(guessDiv);

    let songPlayer = document.getElementById("song-player");
    songPlayer.play();

    let songPrev = document.getElementById("song-preview");
    songPrev.style.display = "none";

    let correctDiv = document.createElement("div");
    correctDiv.innerText = "Correct!";
    correctDiv.id = "correct-div";
    guessDiv.appendChild(correctDiv);

    let nextButton = document.getElementById("next-button");

    if (nextButton === null) {
        nextButton = document.createElement("button");
        nextButton.className = "green-button";
        nextButton.id = "next-button";
        nextButton.textContent = "Next Song";
        nextButton.style.display = "initial";
        guessDiv.appendChild(nextButton);
    } else {
        nextButton.style.display = "initial";
        guessDiv.appendChild(nextButton);
    }
}


function hintButton() {
    if (isGameOver) {
        return;
    }
    var hintButton = document.getElementById("hint-button");
    var hintDiv = document.getElementById("hint-section");

    // no more hints
    if (hintDiv == null) {
        var hintDiv = document.createElement("div");
        hintDiv.id = "hint-section";

        var firstHint = document.createElement("div");
        firstHint.id = "first-hint";
        var songTitle = "The artist is: " + document.getElementById("song-artist").value;
        firstHint.textContent = songTitle;

        hintButton.innerText = "Get Another Hint";
        hintDiv.appendChild(firstHint);
        hintButton.parentNode.appendChild(hintDiv);
    } else if (hintDiv.childElementCount == 1) {
        var secondHint = document.createElement("div");
        secondHint.id = "second-hint";
        var songAlbum = "The album is: " + document.getElementById("song-album").value;
        secondHint.textContent = songAlbum;

        hintDiv.appendChild(secondHint);
    } else if (hintDiv.childElementCount == 2) {
        var thirdHint = document.createElement("div");
        thirdHint.id = "third-hint";
        var songLetter = "The song starts with the letter " + document.getElementById("song-title").value[0];
        thirdHint.textContent = songLetter;
        
        hintDiv.appendChild(thirdHint);
    } else if (hintDiv.childElementCount == 3) {
        var fourthint = document.createElement("div");
        fourthint.id = "fourth-hint";
        var songLength = (document.getElementById("song-title").value.split(" ")).length;
        if (songLength == 1) {
            var numWords = "The song title is " + songLength + " word long";
        } else {
            var numWords = "The song title is " + songLength + " words long";
        }
        fourthint.textContent = numWords;
        
        hintDiv.appendChild(fourthint);
    } else if (hintDiv.childElementCount == 4) {
        hintButton.innerText = "You only get four hints!";
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


const displaySong = song => {
  document.getElementById('song-title').value = song.title;
  document.getElementById('song-artist').value = song.artist;
  document.getElementById('song-album').value = song.album;
  document.getElementById('song-player').src = song.preview_url;
  document.getElementById('song-preview').style.display = 'block';
  document.getElementById('song-album').src = song.image_url;
  document.getElementById("song-album-to-guess").src = song.image_url;
}


function fetchNextSong() {
    if (isGameOver) {
        return;
    }
    if (countdownInterval) {
        clearInterval(countdownInterval);
        countdownInterval = null;
    }

  fetch('skip-to-next-song/')
  .then(res => res.json())
  .then(data => {
    if (data.random_song) {
      displaySong(data.random_song);
      const urlParams = new URLSearchParams(window.location.search);
      const gamemode = urlParams.get('mode');
      if (gamemode == "timed") {
        let time = 30; // Set initial time
        const scoreText = document.getElementById("score");
        scoreText.innerText = 'Time Left: 30'
        countdownInterval = setInterval(() => {
          time -= 1; // Decrement time
          if (time > 0) {
            scoreText.textContent = `Time Left: ${time}`;
          } else {
            clearInterval(countdownInterval); // Stop the countdown
            scoreText.textContent = "Time's up!";
            endGame();
          }
        }, 1000); // Update every second (1000 milliseconds)
      }
    }
  })
  .catch(error => {
    console.error("An error occurred:", error);
    // Redirect on fetch error
    window.location.href = '/error/'; // Redirect to error page
  })
}

function skipSong() {
    if (isGameOver) {
        return;
    }
    // This hint stuff makes sure that the hints dont continue showing when the skip song button is pressed
    const hintButton = document.getElementById("hint-button");
    if (hintButton) {
        hintButton.innerText = "Give Me a Hint!";
    }

    const hintSection = document.getElementById("hint-section");
    if (hintSection) {
        hintSection.remove(); // Clear all hints when skipping
    }
}

// To load the very first song (hopefully doesnt cause issues)
fetchNextSong()

// Attempt to reset the game page without having the window reload
function resetGamePage(game) {
    if (isGameOver) {
        return;
    }
    // Tried to fix the hints here but im not sure if this is doing anything good
    let hintSection = document.getElementById("hint-section");
    if (hintSection) {
        hintSection.remove();
    }


    let guessDiv = document.getElementById("guess-div");

    // Clear guess-div to start fresh
    clearGuessDiv(guessDiv);

    let enterGuessText = document.createElement("p");
    enterGuessText.className = "text";
    enterGuessText.textContent = "Enter Your Guess:";

    // Recreate the score-div and guess input field
    let scoreDiv = document.createElement("div");
    scoreDiv.id = "score-div";
    scoreDiv.innerHTML = '<p id="score" class="text"></p>';

    let songArtist = document.createElement("input");
    songArtist.type = "hidden";
    songArtist.id = "song-artist";
    songArtist.value = "";

    let songTitle = document.createElement("input");
    songTitle.type = "hidden";
    songTitle.id = "song-title";
    songTitle.value = "";

    let hiddenSongAlbum = document.createElement("input");
    hiddenSongAlbum.type = "hidden";
    hiddenSongAlbum.id = "song-album";
    hiddenSongAlbum.value = "";


    // Recreate the guess input field and submit button
    let guessInput = document.createElement("input");
    guessInput.type = "text";
    guessInput.id = "guess";
    guessInput.name = "guess";
    guessInput.style.width = "40vh";
    guessInput.style.margin = "10px";

    let submitButton = document.createElement("button");
    submitButton.className = "green-button";
    submitButton.id = "submit-button";
    submitButton.textContent = "Submit";

    // Recreate the hint button and skip button
    let hintButton2 = document.createElement("button");
    hintButton2.className = "green-button";
    hintButton2.id = "hint-button";
    hintButton2.textContent = "Give Me a Hint!";
    hintButton2.style.margin = "18px";

    let skipButton = document.createElement("button");
    skipButton.className = "green-button small";
    skipButton.id = "skip-button";
    skipButton.textContent = "Skip Song";

    // Add these elements to guess-div
    guessDiv.appendChild(scoreDiv);
    guessDiv.appendChild(enterGuessText);

    let inputContainer = document.createElement("div");
    inputContainer.style.display = "flex";
    inputContainer.style.flexDirection = "row";
    inputContainer.style.height = "7vh";

    inputContainer.appendChild(guessInput);
    inputContainer.appendChild(submitButton);
    guessDiv.appendChild(inputContainer);

    guessDiv.appendChild(hintButton2);
    guessDiv.appendChild(skipButton);
    guessDiv.appendChild(songArtist);
    guessDiv.appendChild(hiddenSongAlbum);
    guessDiv.appendChild(songTitle);

   // submitButton.addEventListener("click", game.submitGuess);
   // hintButton2.addEventListener("click", hintButton);
   // skipButton.addEventListener("click", skipSong);


    // Hide the next button 
    let nextButton = document.getElementById("next-button");
    if (nextButton) {
        nextButton.style.display = "none";
    }

    // Reset the song preview
    let songPrev = document.getElementById("song-preview");
    if (songPrev) {
        songPrev.style.display = "block"; // Show the preview
    }

    // Reset the song player
    let songPlayer = document.getElementById("song-player");
    if (songPlayer) {
        songPlayer.pause(); // Pause any playing song
        songPlayer.currentTime = 0; // Reset song time
    }

    game.updateScoreDisplay(); // for some reason necessary for score display

    fetchNextSong() // this to load the very first song (hopefully doesn't cause issues)
}


document.addEventListener('DOMContentLoaded', function () {

    // Parse gamemode from URL
    const urlParams = new URLSearchParams(window.location.search);
    const gamemode = urlParams.get('mode');

    const game = new Game(gamemode);

    document.getElementById('spotify-logout').addEventListener("click", logoutFromSpotify);


    // I had issues with attaching the event listeners again after reloading the game so i just made them to be like this
    document.getElementById('guess-div').addEventListener("click", function (event) {
        
        if (isGameOver) {
            return;
        }
        const targetId = event.target.id;

        switch (targetId) {
            case "submit-button":
                game.submitGuess();
                game.updateScoreDisplay();
                break;
            case "hint-button":
                hintButton();
                break;
            case "next-button":
                resetGamePage(game);
                break;
            case "skip-button":
                skipSong();
                fetchNextSong();
                game.adjustScore(false);
                game.updateScoreDisplay(); 
                break;
            default:
                break;
        }
    });
});

