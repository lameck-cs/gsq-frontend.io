// Store game state in local storage
const gameState = JSON.parse(localStorage.getItem("gameState")) || {
    playerName: "",
    score: 0,
    leaderboard: []
};

const words = {
    animals: ["tiger", "lion", "bear", "fox", "wolf", "eagle"],
    science: ["atom", "force", "energy", "light", "wave"],
    nature: ["tree", "plant", "river", "mountain", "cloud"],
};

let selectedTopic = "animals";
let currentWord = "";
let letters = [];
let selectedLetters = "";
let score = gameState.score;

// Start game
function startGame() {
    const playerName = document.getElementById("playerName").value.trim();
    if (playerName === "") {
        showFeedback("Please enter your name!", "red");
        return;
    }
    gameState.playerName = playerName;
    localStorage.setItem("gameState", JSON.stringify(gameState));

    generateWord();
    updateScore();
    updateLeaderboard();
}

// Generate a word from the selected topic
function generateWord() {
    const wordList = words[selectedTopic];
    currentWord = wordList[Math.floor(Math.random() * wordList.length)];
    letters = currentWord.split("").sort(() => Math.random() - 0.5);

    displayLetters();
}

// Display letters in a circular pattern
function displayLetters() {
    const container = document.getElementById("letters-container");
    container.innerHTML = "";

    const radius = 100;
    const centerX = 125, centerY = 125;
    const angleStep = (2 * Math.PI) / letters.length;

    letters.forEach((letter, index) => {
        const angle = index * angleStep;
        const x = centerX + radius * Math.cos(angle) - 20;
        const y = centerY + radius * Math.sin(angle) - 20;

        const letterDiv = document.createElement("div");
        letterDiv.classList.add("letter");
        letterDiv.style.left = `${x}px`;
        letterDiv.style.top = `${y}px`;
        letterDiv.innerText = letter;
        letterDiv.onclick = () => selectLetter(letter);

        container.appendChild(letterDiv);
    });
}

// Select a letter
function selectLetter(letter) {
    selectedLetters += letter;
    document.getElementById("selectedWord").innerText = selectedLetters;
}

// Clear selected letters
function clearSelection() {
    selectedLetters = "";
    document.getElementById("selectedWord").innerText = "";
}

// Submit a word
function submitWord() {
    if (selectedLetters.length < 2) {
        showFeedback("Word must have at least 2 letters.", "red");
        return;
    }

    fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${selectedLetters}`)
        .then(response => response.json())
        .then(data => {
            if (data.title === "No Definitions Found") {
                showFeedback("Incorrect word!", "red");
            } else {
                score += selectedLetters.length;
                updateScore();
                saveLeaderboard();
                showFeedback(`Correct! You found: ${selectedLetters}`, "green");
            }
            clearSelection();
        })
        .catch(() => {
            showFeedback("Error checking word!", "red");
        });
}

// Provide a hint
function getHint() {
    showFeedback(`Hint: The word starts with '${currentWord[0]}'`, "blue");
}

// Update and save the score
function updateScore() {
    document.getElementById("score").innerText = `Score: ${score}`;
    gameState.score = score;
    localStorage.setItem("gameState", JSON.stringify(gameState));
}

// Save to leaderboard
function saveLeaderboard() {
    const playerName = gameState.playerName;
    const existingPlayer = gameState.leaderboard.find(p => p.name === playerName);

    if (existingPlayer) {
        existingPlayer.score = score;
    } else {
        gameState.leaderboard.push({ name: playerName, score });
    }

    gameState.leaderboard.sort((a, b) => b.score - a.score);
    localStorage.setItem("gameState", JSON.stringify(gameState));
    updateLeaderboard();
}

// Update leaderboard display
function updateLeaderboard() {
    const leaderboardList = document.getElementById("leaderboard-list");
    leaderboardList.innerHTML = "";

    gameState.leaderboard.forEach(player => {
        const listItem = document.createElement("li");
        listItem.innerText = `${player.name}: ${player.score} pts`;
        leaderboardList.appendChild(listItem);
    });
}

// Show feedback on the page
function showFeedback(message, color) {
    const feedbackElement = document.getElementById("feedbackMessage");
    feedbackElement.innerText = message;
    feedbackElement.style.color = color;
}

// Load game state on page load
document.addEventListener("DOMContentLoaded", () => {
    if (gameState.playerName) {
        document.getElementById("playerName").value = gameState.playerName;
        score = gameState.score;
        updateScore();
        updateLeaderboard();
        generateWord();
    }
});
