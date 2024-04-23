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
        // this.updateScoreDisplay();
    }


    updateScoreDisplay() {
        let scoreText = document.getElementById("score");
        let newText = "";
        switch (this.mode) {
            case "streak":
                newText = `Streak: ${this.streak}`;
                break;
            case "timed":
                newText = `Time Left: ${Date.now() - this.startTime}`;
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



async function fetchNextSong() {
    try {
        // Send a GET request to the SkipToNextSong endpoint
        const response = await fetch('skip-to-next-song/'); 

        if (response.ok) {
            const data = await response.json();

            if (data.random_song) {
                const randomSong = data.random_song;

                // Update the elements with the new song's information
                document.getElementById('song-title').value = randomSong.title;
                document.getElementById('song-artist').value = randomSong.artist;
                document.getElementById('song-album').value = randomSong.album;
                document.getElementById('song-player').src = randomSong.preview_url;
                document.getElementById('song-preview').style.display = 'block';
                document.getElementById('song-album').src = randomSong.image_url;
                document.getElementById("song-album-to-guess").src = randomSong.image_url;
                console.log("Next song loaded successfully.");
            } else {
                console.error("No song returned in the response.");
            }
        } else {
            console.error("Failed to fetch the next song. Status:", response.status);
            // Redirect on error status
            window.location.href = '/error/'; // Redirect to error page
        }
    } catch (error) {
        console.error("An error occurred:", error);
        // Redirect on fetch error
        window.location.href = '/error/'; // Redirect to error page
    }
}

function skipSong() {

    // This hint stuff makes sure that the hints dont continue showing when the skip song button is pressed
    const hintButton = document.getElementById("hint-button");
    if (hintButton) {
        hintButton.innerText = "Give Me a Hint!";
    }

    const hintSection = document.getElementById("hint-section");
    if (hintSection) {
        hintSection.remove(); // Clear all hints when skipping
    }
    fetchNextSong();
}

// To load the very first song (hopefully doesnt cause issues)
skipSong()

// Attempt to reset the game page without having the window reload
function resetGamePage(game) {

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
    scoreDiv.innerHTML = '<p id="score" class="text">SCORE: 0</p>';

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

    submitButton.addEventListener("click", game.submitGuess);
    hintButton2.addEventListener("click", hintButton);
    skipButton.addEventListener("click", skipSong);


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

    game.updateScoreDisplay(); // Not sure if this is working either 

    skipSong() // this to load the very first song (hopefully doesn't cause issues)
}


document.addEventListener('DOMContentLoaded', function () {

    // Parse gamemode from URL
    const urlParams = new URLSearchParams(window.location.search);
    const gamemode = urlParams.get('mode');

    const game = new Game(gamemode);

    // I had issues with attaching the event listeners again after reloading the game so i just made them to be like this
    document.getElementById('guess-div').addEventListener("click", function (event) {
        const targetId = event.target.id;

        switch (targetId) {
            case "spotify-logout":
                logoutFromSpotify();
                break;
            case "submit-button":
                game.submitGuess();
                break;
            case "hint-button":
                hintButton();
                break;
            case "next-button":
                resetGamePage(game);
                break;
            case "skip-button":
                skipSong();
                break;
            default:
                break;
        }
    });
});

