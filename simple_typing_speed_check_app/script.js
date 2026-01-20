let startTime;
let timerInterval;

const displayText = document.getElementById('display-text').innerText;
const typingArea = document.getElementById('typing-area');
const startBtn = document.getElementById('start-btn');
const resultsDiv = document.getElementById('results');
const timeTakenSpan = document.getElementById('time-taken');
const timerDisplay = document.getElementById('timer-display');
const starterText = document.getElementById('starter-text');

function startTest() {
    typingArea.value = '';
    typingArea.classList.remove('hidden');
    starterText.classList.add('hidden');
    typingArea.focus();
    resultsDiv.classList.add('hidden');
    startTime = performance.now();

    timerInterval = setInterval(() => {
        const currentTime = performance.now();
        const elapsed = currentTime - startTime;

        const formattedTime = (elapsed / 1000).toFixed(3);
        timerDisplay.innerText = `${formattedTime}s`;
    }, 10);
}

function finishTest(timeTaken) {
    clearInterval(timerInterval);
    const typedText = typingArea.value.trim();
    const wordCount = typedText.split(/\s+/).filter(word => word.length > 0).length;

    const timeInMinutes = timeTaken / 60000;

    timeTakenSpan.innerText = timeTaken.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    resultsDiv.classList.remove('hidden');
    typingArea.classList.add('hidden');

    const formattedTime = (timeTaken / 1000).toFixed(3);
    timerDisplay.innerText = `${formattedTime}s`;
}

startBtn.addEventListener('click', startTest);

typingArea.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        event.preventDefault(); // Prevent newline in textarea
        if (!startTime) {
            startTest();
        } else {
            const endTime = performance.now();
            const elapsed = endTime - startTime;
            finishTest(elapsed);
        }
    }
});

// Also allow starting with Enter even if textarea is not focused initially
document.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && !startTime && document.activeElement !== typingArea) {
        event.preventDefault();
        startTest();
    }
});
