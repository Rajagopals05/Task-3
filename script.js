document.addEventListener("DOMContentLoaded", () => {

    // --- 1. Interactive Quiz Logic ---
    const quizData = [
        {
            question: "Which keyword declares a block-scoped variable in JavaScript?",
            options: ["var", "let", "def", "string"],
            answer: 1
        },
        {
            question: "What does DOM stand for?",
            options: [
                "Document Object Model",
                "Display Object Management",
                "Digital Oriented Method",
                "Data Output Mode"
            ],
            answer: 0
        },
        {
            question: "Which method is used to make asynchronous HTTP requests?",
            options: ["fetch()", "get()", "pull()", "request()"],
            answer: 0
        }
    ];

    let currentQuestionIndex = 0;
    let score = 0;

    const questionText = document.getElementById("questionText");
    const optionsContainer = document.getElementById("optionsContainer");
    const nextBtn = document.getElementById("nextBtn");
    const quizContainer = document.getElementById("quizContainer");
    const scoreContainer = document.getElementById("scoreContainer");
    const scoreText = document.getElementById("scoreText");
    const restartBtn = document.getElementById("restartBtn");

    function loadQuestion() {
        resetState();
        const currentData = quizData[currentQuestionIndex];
        questionText.textContent = `${currentQuestionIndex + 1}. ${currentData.question}`;

        currentData.options.forEach((option, index) => {
            const button = document.createElement("button");
            button.textContent = option;
            button.classList.add("option-btn");
            button.addEventListener("click", () => selectOption(button, index, currentData.answer));
            optionsContainer.appendChild(button);
        });
    }

    function resetState() {
        nextBtn.classList.add("hidden");
        optionsContainer.innerHTML = "";
    }

    function selectOption(selectedBtn, selectedIndex, correctIndex) {
        const allButtons = optionsContainer.querySelectorAll(".option-btn");
        allButtons.forEach((btn, idx) => {
            btn.disabled = true;
            if (idx === correctIndex) btn.classList.add("correct");
        });

        if (selectedIndex === correctIndex) {
            score++;
        } else {
            selectedBtn.classList.add("incorrect");
        }

        nextBtn.classList.remove("hidden");
    }

    nextBtn.addEventListener("click", () => {
        currentQuestionIndex++;
        if (currentQuestionIndex < quizData.length) {
            loadQuestion();
        } else {
            showScore();
        }
    });

    function showScore() {
        quizContainer.classList.add("hidden");
        scoreContainer.classList.remove("hidden");
        scoreText.textContent = `You scored ${score} out of ${quizData.length}!`;
    }

    restartBtn.addEventListener("click", () => {
        score = 0;
        currentQuestionIndex = 0;
        scoreContainer.classList.add("hidden");
        quizContainer.classList.remove("hidden");
        loadQuestion();
    });

    loadQuestion();

    // --- 2. API Data Fetching with Fallback ---
    const jokeSetup = document.getElementById("jokeSetup");
    const jokeDelivery = document.getElementById("jokeDelivery");
    const fetchBtn = document.getElementById("fetchBtn");

    const localJokes = [
        { setup: "Why do programmers prefer dark mode?", delivery: "Because light attracts bugs!" },
        { setup: "How many programmers does it take to change a lightbulb?", delivery: "None, that's a hardware problem." },
        { setup: "There are 10 types of people in the world:", delivery: "Those who understand binary, and those who don't." },
        { setup: "Why do Java developers wear glasses?", delivery: "Because they don't C#!" }
    ];

    async function fetchJoke() {
        jokeSetup.textContent = "Fetching data...";
        jokeDelivery.textContent = "";

        try {
            const response = await fetch("https://v2.jokeapi.dev/joke/Programming?type=twopart");
            if (!response.ok) throw new Error("Network error");
            
            const data = await response.json();
            if (data.type === "twopart") {
                jokeSetup.textContent = data.setup;
                jokeDelivery.textContent = data.delivery;
            } else {
                jokeSetup.textContent = data.joke;
            }
        } catch (error) {
            // Fallback gracefully if API request fails or is blocked by CORS/network
            const randomJoke = localJokes[Math.floor(Math.random() * localJokes.length)];
            jokeSetup.textContent = randomJoke.setup;
            jokeDelivery.textContent = randomJoke.delivery;
        }
    }

    fetchBtn.addEventListener("click", fetchJoke);
});