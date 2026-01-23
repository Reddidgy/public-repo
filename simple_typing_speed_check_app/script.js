let startTime;
let timerInterval;

const displayText = document.getElementById('display-text').innerText;
const typingArea = document.getElementById('typing-area');
const startBtn = document.getElementById('start-btn');
const resultsDiv = document.getElementById('results');
const timeTakenSpan = document.getElementById('time-taken');
const timerDisplay = document.getElementById('timer-display');
const starterText = document.getElementById('starter-text');
const accuracySpan = document.getElementById('accuracy');
const scoreSpan = document.getElementById('score');

const EXCLUDED_CHARS = ['[', ']', '}', ':', '.', '_', '{', '-', '"', "'", '`'];

function filterSpecials(text) {
    return text.split('').filter(char => !EXCLUDED_CHARS.includes(char)).join('');
}

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

    // Accuracy Calculation
    const filteredRef = filterSpecials(displayText);
    const filteredTyped = filterSpecials(typedText);

    let correctChars = 0;
    const minLength = Math.min(filteredRef.length, filteredTyped.length);

    for (let i = 0; i < minLength; i++) {
        if (filteredRef[i] === filteredTyped[i]) {
            correctChars++;
        }
    }

    const accuracy = filteredRef.length > 0 ? (correctChars / filteredRef.length) * 100 : 0;
    accuracySpan.innerText = accuracy.toFixed(2);

    // Score Calculation: Score = ( (1 / Time) * (Accuracy ^ 8) ) * 10,000
    // Using decimal accuracy (0-1) for the formula
    const decimalAccuracy = accuracy / 100;
    const score = ((1 / timeTaken) * Math.pow(decimalAccuracy, 8)) * 1000000;
    scoreSpan.innerText = score.toFixed(2);
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

// Anti-cheat measures: Disable copy, paste, cut, context menu, and text selection
['paste', 'copy', 'cut', 'contextmenu', 'selectstart', 'select'].forEach(event => {
    typingArea.addEventListener(event, (e) => e.preventDefault());
});

// Global anti-cheat for display text and other elements
[
    document.getElementById('display-text'),
    document.getElementById('starter-text'),
    document.querySelector('h1'),
    timerDisplay,
    resultsDiv
].forEach(el => {
    if (el) {
        ['copy', 'contextmenu', 'selectstart'].forEach(event => {
            el.addEventListener(event, (e) => e.preventDefault());
        });
    }
});
