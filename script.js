document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const welcomeScreen = document.getElementById('welcome-screen');
    const quizScreen = document.getElementById('quiz-screen');
    const resultsScreen = document.getElementById('results-screen');
    const leaderboardScreen = document.getElementById('leaderboard-screen');
    
    const startBtn = document.getElementById('start-btn');
    const nextBtn = document.getElementById('next-btn');
    const retryBtn = document.getElementById('retry-btn');
    const leaderboardBtn = document.getElementById('leaderboard-btn');
    const backToQuizBtn = document.getElementById('back-to-quiz-btn');
    
    const usernameInput = document.getElementById('username');
    const questionElement = document.getElementById('question');
    const optionsContainer = document.getElementById('options');
    const feedbackElement = document.getElementById('feedback');
    const questionCountElement = document.getElementById('question-count');
    const scoreElement = document.getElementById('score');
    const timeElement = document.getElementById('time');
    const progressFill = document.getElementById('progress-fill');
    const finalScoreElement = document.getElementById('final-score');
    const performanceComment = document.getElementById('performance-comment');
    
    // Quiz variables
    let currentQuestionIndex = 0;
    let score = 0;
    let timeLeft = 30;
    let timer;
    let username = '';
    let leaderboard = JSON.parse(localStorage.getItem('cosmicQuizLeaderboard')) || [];
    
    // Quiz questions
    const questions = [
        {
            question: "What is the largest planet in our solar system?",
            options: ["Earth", "Saturn", "Jupiter", "Neptune"],
            answer: 2
        },
        {
            question: "Which galaxy is Earth located in?",
            options: ["Andromeda", "Milky Way", "Sombrero", "Whirlpool"],
            answer: 1
        },
        {
            question: "What is the name of the closest star to Earth (other than the Sun)?",
            options: ["Alpha Centauri", "Betelgeuse", "Sirius", "Proxima Centauri"],
            answer: 3
        },
        {
            question: "Which of these is not a type of galaxy?",
            options: ["Spiral", "Elliptical", "Irregular", "Triangular"],
            answer: 3
        },
        {
            question: "What is the phenomenon when a massive star collapses in on itself?",
            options: ["Supernova", "Black hole", "Neutron star", "All of the above"],
            answer: 3
        },
        {
            question: "Which planet is known as the 'Red Planet'?",
            options: ["Venus", "Mars", "Jupiter", "Saturn"],
            answer: 1
        },
        {
            question: "What is the name of the telescope launched in 2021 as the successor to Hubble?",
            options: ["Kepler", "James Webb", "Spitzer", "Chandra"],
            answer: 1
        },
        {
            question: "Which of these elements is most abundant in the universe?",
            options: ["Oxygen", "Carbon", "Hydrogen", "Helium"],
            answer: 2
        },
        {
            question: "What is the name of the theoretical boundary around a black hole from which nothing can escape?",
            options: ["Photon sphere", "Accretion disk", "Event horizon", "Singularity"],
            answer: 2
        },
        {
            question: "Which spacecraft was the first to leave our solar system?",
            options: ["Voyager 1", "Pioneer 10", "New Horizons", "Voyager 2"],
            answer: 0
        }
    ];
    
    // Event Listeners
    startBtn.addEventListener('click', startQuiz);
    nextBtn.addEventListener('click', nextQuestion);
    retryBtn.addEventListener('click', retryQuiz);
    leaderboardBtn.addEventListener('click', showLeaderboard);
    backToQuizBtn.addEventListener('click', () => {
        leaderboardScreen.classList.add('hidden');
        welcomeScreen.classList.remove('hidden');
    });
    
    // Functions
    function startQuiz() {
        username = usernameInput.value.trim();
        if (!username) {
            username = "Cosmic Explorer";
        }
        
        welcomeScreen.classList.add('hidden');
        quizScreen.classList.remove('hidden');
        
        currentQuestionIndex = 0;
        score = 0;
        scoreElement.textContent = score;
        
        showQuestion();
    }
    
    function showQuestion() {
        resetState();
        const currentQuestion = questions[currentQuestionIndex];
        questionElement.textContent = currentQuestion.question;
        questionCountElement.textContent = `${currentQuestionIndex + 1}/${questions.length}`;
        
        currentQuestion.options.forEach((option, index) => {
            const button = document.createElement('button');
            button.textContent = option;
            button.classList.add('option', 'p-4', 'rounded-lg', 'text-left', 'hover:shadow-lg');
            button.addEventListener('click', () => selectAnswer(index));
            optionsContainer.appendChild(button);
        });
        
        startTimer();
    }
    
    function startTimer() {
        timeLeft = 30;
        timeElement.textContent = timeLeft;
        progressFill.style.width = '100%';
        
        clearInterval(timer);
        timer = setInterval(() => {
            timeLeft--;
            timeElement.textContent = timeLeft;
            progressFill.style.width = `${(timeLeft / 30) * 100}%`;
            
            if (timeLeft <= 0) {
                clearInterval(timer);
                timeUp();
            }
        }, 1000);
    }
    
    function timeUp() {
        feedbackElement.textContent = "Time's up!";
        feedbackElement.classList.remove('hidden');
        feedbackElement.style.color = "#ff758c";
        
        const options = optionsContainer.querySelectorAll('.option');
        options.forEach(option => {
            option.disabled = true;
        });
        
        nextBtn.classList.remove('hidden');
    }
    
    function selectAnswer(selectedIndex) {
        clearInterval(timer);
        
        const currentQuestion = questions[currentQuestionIndex];
        const options = optionsContainer.querySelectorAll('.option');
        const correctIndex = currentQuestion.answer;
        
        options.forEach((option, index) => {
            option.disabled = true;
            
            if (index === correctIndex) {
                option.classList.add('correct');
            } else if (index === selectedIndex && selectedIndex !== correctIndex) {
                option.classList.add('incorrect');
            }
        });
        
        if (selectedIndex === correctIndex) {
            // Calculate score based on time left
            const timeBonus = Math.floor(timeLeft * 3);
            score += 100 + timeBonus;
            scoreElement.textContent = score;
            
            feedbackElement.textContent = `Correct! +${100 + timeBonus} points`;
            feedbackElement.classList.remove('hidden');
            feedbackElement.style.color = "#4facfe";
            
            // Create confetti effect
            createConfetti();
        } else {
            feedbackElement.textContent = `Incorrect! The correct answer is: ${currentQuestion.options[correctIndex]}`;
            feedbackElement.classList.remove('hidden');
            feedbackElement.style.color = "#ff758c";
        }
        
        nextBtn.classList.remove('hidden');
    }
    
    function createConfetti() {
        const colors = ['#4facfe', '#00f2fe', '#ff758c', '#ff7eb3', '#ffd700'];
        
        for (let i = 0; i < 50; i++) {
            const confetti = document.createElement('div');
            confetti.classList.add('confetti');
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.left = `${Math.random() * 100}%`;
            confetti.style.top = '-10px';
            confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
            
            quizScreen.appendChild(confetti);
            
            const animationDuration = Math.random() * 3 + 2;
            
            confetti.style.animation = `
                confetti-fall ${animationDuration}s linear forwards,
                confetti-spin ${animationDuration}s linear infinite
            `;
            
            // Create keyframes dynamically
            const style = document.createElement('style');
            style.innerHTML = `
                @keyframes confetti-fall {
                    to {
                        transform: translateY(${window.innerHeight + 10}px) rotate(${Math.random() * 360}deg);
                        opacity: 0;
                    }
                }
                @keyframes confetti-spin {
                    from { transform: translateY(0) rotate(0deg); }
                    to { transform: translateY(0) rotate(360deg); }
                }
            `;
            document.head.appendChild(style);
            
            // Remove confetti after animation
            setTimeout(() => {
                confetti.remove();
                style.remove();
            }, animationDuration * 1000);
        }
    }
    
    function nextQuestion() {
        currentQuestionIndex++;
        
        if (currentQuestionIndex < questions.length) {
            showQuestion();
        } else {
            endQuiz();
        }
    }
    
    function endQuiz() {
        clearInterval(timer);
        quizScreen.classList.add('hidden');
        resultsScreen.classList.remove('hidden');
        
        finalScoreElement.textContent = score;
        
        // Update leaderboard
        updateLeaderboard();
        
        // Performance comment
        const percentage = (score / (questions.length * 130)) * 100;
        if (percentage >= 90) {
            performanceComment.textContent = "Cosmic Genius! You're out of this world!";
        } else if (percentage >= 70) {
            performanceComment.textContent = "Stellar Performance! You're shining bright!";
        } else if (percentage >= 50) {
            performanceComment.textContent = "Good job! Keep reaching for the stars!";
        } else {
            performanceComment.textContent = "Keep practicing! The universe is waiting!";
        }
    }
    
    function updateLeaderboard() {
        // Add current score to leaderboard
        leaderboard.push({
            name: username,
            score: score,
            date: new Date().toISOString()
        });
        
        // Sort leaderboard by score (descending)
        leaderboard.sort((a, b) => b.score - a.score);
        
        // Keep only top 10 scores
        if (leaderboard.length > 10) {
            leaderboard = leaderboard.slice(0, 10);
        }
        
        // Save to localStorage
        localStorage.setItem('cosmicQuizLeaderboard', JSON.stringify(leaderboard));
    }
    
    function showLeaderboard() {
        resultsScreen.classList.add('hidden');
        leaderboardScreen.classList.remove('hidden');
        
        // Update podium
        if (leaderboard.length > 0) {
            document.getElementById('first-place').textContent = leaderboard[0].name;
            document.getElementById('first-score').textContent = `${leaderboard[0].score} pts`;
        }
        
        if (leaderboard.length > 1) {
            document.getElementById('second-place').textContent = leaderboard[1].name;
            document.getElementById('second-score').textContent = `${leaderboard[1].score} pts`;
        }
        
        if (leaderboard.length > 2) {
            document.getElementById('third-place').textContent = leaderboard[2].name;
            document.getElementById('third-score').textContent = `${leaderboard[2].score} pts`;
        }
        
        // Update leaderboard list
        const leaderboardList = document.getElementById('leaderboard-list');
        leaderboardList.innerHTML = '';
        
        leaderboard.forEach((entry, index) => {
            const entryElement = document.createElement('div');
            entryElement.classList.add('leaderboard-entry', 'p-4', 'rounded-lg', 'flex', 'justify-between', 'items-center');
            
            const rankElement = document.createElement('span');
            rankElement.classList.add('font-bold', 'w-8', 'text-center');
            rankElement.textContent = `${index + 1}.`;
            
            const nameElement = document.createElement('span');
            nameElement.classList.add('flex-1', 'ml-4');
            nameElement.textContent = entry.name;
            
            const scoreElement = document.createElement('span');
            scoreElement.classList.add('font-bold');
            scoreElement.textContent = `${entry.score} pts`;
            
            const dateElement = document.createElement('span');
            dateElement.classList.add('text-sm', 'text-gray-400', 'ml-4');
            dateElement.textContent = new Date(entry.date).toLocaleDateString();
            
            entryElement.appendChild(rankElement);
            entryElement.appendChild(nameElement);
            entryElement.appendChild(scoreElement);
            entryElement.appendChild(dateElement);
            
            leaderboardList.appendChild(entryElement);
        });
    }
    
    function retryQuiz() {
        resultsScreen.classList.add('hidden');
        welcomeScreen.classList.remove('hidden');
    }
    
    function resetState() {
        feedbackElement.classList.add('hidden');
        nextBtn.classList.add('hidden');
        
        while (optionsContainer.firstChild) {
            optionsContainer.removeChild(optionsContainer.firstChild);
        }
    }
});