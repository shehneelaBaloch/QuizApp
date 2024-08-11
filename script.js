const landingPage = document.querySelector(".landing-page");
const gameCategory = document.querySelector(".game-category");
const quizSection = document.querySelector(".quiz");
const questionElement = document.getElementById("question");
const optionsContainer = document.getElementById("options-container");

let currentQuestionIndex = 0;
let questions = [];
let score = 0; // Initialize score

// Function to show the landing page and hide other sections
function showLandingPage() {
    landingPage.style.display = "";
    gameCategory.style.display = "none";
    quizSection.style.display = "none";
}

// Function to show the game category selection and hide other sections
function showGameCategory() {
    landingPage.style.display = "none";
    gameCategory.style.display = "";
    quizSection.style.display = "none";
}

// Function to show the quiz and hide other sections
function showQuiz(category) {
    landingPage.style.display = "none";
    gameCategory.style.display = "none";
    quizSection.style.display = "";
    // Load questions when quiz section is shown
    getQuestions(category);
     // Log the API response to inspect it

}

// Function to fetch questions from the Open Trivia Database API
async function getQuestions(category) {
    const API_URL = `https://opentdb.com/api.php?amount=20&type=multiple&category=${encodeURIComponent(category)}`;
    try {
        const response = await fetch(API_URL);
        const data = await response.json();

        // Check if the question property exists
        if (data.results && data.results.length > 0 && data.results[0].question) {
            questions = data.results;
            displayQuestion();
        } else {
            console.error("Invalid data format:", data);
        }
    } catch (error) {
        console.error("Error fetching questions:", error);
    }
}

// Function to display the current question
function displayQuestion() {
    optionsContainer.style.display = '';
    const currentQuestion = questions[currentQuestionIndex];

    // Check if the currentQuestion object and its question property exist
    if (currentQuestion && currentQuestion.question) {
        questionElement.textContent = currentQuestion.question;

        optionsContainer.innerHTML = "";
        currentQuestion.incorrect_answers.forEach((option) => {
            addOption(option, false);
        });

        addOption(currentQuestion.correct_answer, true);
    } else {
        console.error("Invalid question format:", currentQuestion);
    }
}

// Function to add option buttons to the options container
function addOption(text, isCorrect) {
    const optionElement = document.createElement("button");
    optionElement.textContent = text;
    optionElement.classList.add("option");
    optionElement.dataset.correct = isCorrect;
    optionElement.addEventListener("click", selectOption); // Attach the event handler
    optionsContainer.appendChild(optionElement);
}

// Function to handle option selection
async function selectOption(event) {
    const selectedOption = event.target;
    const isCorrect = selectedOption.dataset.correct === "true";

    if (isCorrect) {
        questionElement.textContent = "Correct!";
        score++; // Increment score for correct answer
    } else {
        questionElement.textContent = "Incorrect!";
    }

    optionsContainer.style.display = 'none';

    currentQuestionIndex++;

    if (currentQuestionIndex < questions.length) {
        // Wait for 0.5 seconds before showing the next question
        await new Promise(resolve => setTimeout(resolve, 500));
        displayQuestion();
    } else {
        // Quiz completed, save progress and show result
        await new Promise(resolve => setTimeout(resolve, 500));
        questionElement.textContent = `Quiz completed! Your score is ${score} out of ${questions.length}.`;

        // Save progress to local storage
        saveProgress(score, questions.length);

        optionsContainer.style.display = 'none';
        currentQuestionIndex = 0;
        score = 0; // Reset score for future quizzes
    }
}

// Function to save progress to local storage
function saveProgress(score, totalQuestions) {
    const progress = {
        score: score,
        totalQuestions: totalQuestions,
        date: new Date().toLocaleString()
    };

    // Save progress in local storage under a key 'quizProgress'
    localStorage.setItem('quizProgress', JSON.stringify(progress));
}

// Initial setup
showLandingPage();
