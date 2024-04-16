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