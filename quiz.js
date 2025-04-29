let currentQuestionIndex = 0;
let score = 0;
let quizQuestions = [];
let playerName = "";
let timeElapsed = 0; // ⏳ Start from 0 seconds
let timerInterval;

function startTimer() {
    const timerDisplay = document.getElementById("timer");
    timerInterval = setInterval(() => {
        let minutes = Math.floor(timeElapsed / 60);
        let seconds = timeElapsed % 60;
        timerDisplay.textContent = `Time Elapsed: ${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
        timeElapsed++;
    }, 1000);
}

async function fetchQuiz() {
    playerName = document.getElementById("playerName").value.trim();
    if (!playerName) {
        alert("Please enter your name.");
        return;
    }

    const topic = document.getElementById("topic").value.trim();
    if (!topic) {
        alert("Please enter a topic.");
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/quiz?topic=${encodeURIComponent(topic)}`);
        const data = await response.json();

        if (!Array.isArray(data) || data.length === 0) {
            alert("No quiz found for this topic.");
            return;
        }

        localStorage.setItem("quizQuestions", JSON.stringify(data));
        quizQuestions = data;
        currentQuestionIndex = 0;
        score = 0;
        timeElapsed = 0; // Reset timer to 0
        startTimer();
        displayQuiz();
    } catch (error) {
        console.error("Error fetching quiz:", error);
        alert("Failed to load quiz.");
    }
}

function displayQuiz() {
    const quizContainer = document.getElementById("quiz-container");
    quizContainer.innerHTML = "";

    if (currentQuestionIndex >= quizQuestions.length) {
        clearInterval(timerInterval);
        showResults();
        return;
    }

    const q = quizQuestions[currentQuestionIndex];
    const questionElement = document.createElement("div");
    questionElement.classList.add("question");
    questionElement.innerHTML = `<p><strong>${currentQuestionIndex + 1}. ${q.question}</strong></p>`;

    const optionsContainer = document.createElement("div");
    optionsContainer.classList.add("options-container");

    q.options.forEach((option, i) => {
        const optionElement = document.createElement("button");
        optionElement.classList.add("option-btn");
        optionElement.textContent = `${String.fromCharCode(65 + i)}. ${option}`;
        optionElement.onclick = () => checkAnswer(option, q.correctAnswer, optionElement);
        optionsContainer.appendChild(optionElement);
    });

    questionElement.appendChild(optionsContainer);
    quizContainer.appendChild(questionElement);
}

function checkAnswer(selected, correct, button) {
    const options = document.querySelectorAll(".option-btn");

    if (selected === correct) {
        button.style.backgroundColor = "green";
        score += 20;
    } else {
        button.style.backgroundColor = "red";
    }

    options.forEach(btn => btn.disabled = true);
    setTimeout(() => {
        currentQuestionIndex++;
        displayQuiz();
    }, 1000);
}

function showResults() {
    const quizContainer = document.getElementById("quiz-container");
    clearInterval(timerInterval);
    
    quizContainer.innerHTML = `
        <h2>Quiz Completed!</h2>
        <p>${playerName}, your score: ${score}/100</p>
        <p>Time Taken: ${Math.floor(timeElapsed / 60)} minutes ${timeElapsed % 60} seconds</p>
    `;

    quizQuestions.forEach((q, index) => {
        const questionReview = document.createElement("div");
        questionReview.classList.add("question-review");
        questionReview.innerHTML = `<p><strong>${index + 1}. ${q.question}</strong></p>`;

        const correctAnswerElement = document.createElement("p");
        correctAnswerElement.textContent = `Correct Answer: ${q.correctAnswer}`;
        correctAnswerElement.style.color = "green";

        questionReview.appendChild(correctAnswerElement);
        quizContainer.appendChild(questionReview);
    });

    updateLeaderboard();
}

function updateLeaderboard() {
    let leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
    leaderboard.push({ name: playerName, score: score, time: timeElapsed });
    leaderboard.sort((a, b) => b.score - a.score || a.time - b.time);
    localStorage.setItem("leaderboard", JSON.stringify(leaderboard));

    const leaderboardContainer = document.getElementById("leaderboard");
    leaderboardContainer.innerHTML = "<h3>Leaderboard</h3><ul>";

    leaderboard.forEach((entry, index) => {
        leaderboardContainer.innerHTML += `<li>${index + 1}. ${entry.name} - ${entry.score} points - ${Math.floor(entry.time / 60)}m ${entry.time % 60}s</li>`;
    });

    leaderboardContainer.innerHTML += "</ul>";
}
