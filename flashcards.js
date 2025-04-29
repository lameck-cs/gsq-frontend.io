document.addEventListener("DOMContentLoaded", loadFlashcards);

function addFlashcard() {
    const question = document.getElementById("flashcard-question").value.trim();
    const answer = document.getElementById("flashcard-answer").value.trim();

    if (!question || !answer) {
        alert("Please enter both a question and an answer.");
        return;
    }

    const flashcards = JSON.parse(localStorage.getItem("flashcards")) || [];

    flashcards.push({ question, answer });
    localStorage.setItem("flashcards", JSON.stringify(flashcards));

    document.getElementById("flashcard-question").value = "";
    document.getElementById("flashcard-answer").value = "";

    loadFlashcards();
}

function loadFlashcards() {
    const flashcardList = document.getElementById("flashcard-list");
    const flashcards = JSON.parse(localStorage.getItem("flashcards")) || [];

    flashcardList.innerHTML = "";

    if (flashcards.length === 0) {
        flashcardList.innerHTML = "<p>No flashcards added yet.</p>";
        return;
    }

    flashcards.forEach((flashcard, index) => {
        const card = document.createElement("div");
        card.classList.add("flashcard");
        card.innerHTML = `
            <p class="flashcard-question">${flashcard.question}</p>
            <button onclick="toggleAnswer(${index})">Show Answer</button>
            <p class="flashcard-answer" id="answer-${index}" style="display: none;">${flashcard.answer}</p>
            <button class="delete-btn" onclick="deleteFlashcard(${index})">Delete</button>
        `;
        flashcardList.appendChild(card);
    });
}

function toggleAnswer(index) {
    const answer = document.getElementById(`answer-${index}`);
    answer.style.display = answer.style.display === "none" ? "block" : "none";
}

function deleteFlashcard(index) {
    let flashcards = JSON.parse(localStorage.getItem("flashcards")) || [];
    flashcards.splice(index, 1);
    localStorage.setItem("flashcards", JSON.stringify(flashcards));
    loadFlashcards();
}
