document.getElementById("streak").addEventListener("click", () => {
  window.location.href = "/spotifyauth/game?mode=streak";
})

document.getElementById("timed").addEventListener("click", () => {
  window.location.href = "/spotifyauth/game?mode=timed";
})

document.getElementById("bo10").addEventListener("click", () => {
  window.location.href = "/spotifyauth/game?mode=bo10";
})
