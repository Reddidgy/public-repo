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
const diffView = document.getElementById('diff-view');
const diffMistakes = document.getElementById('diff-mistakes');
const diffFixes = document.getElementById('diff-fixes');
const diffAccuracy = document.getElementById('diff-accuracy');
const lineNumbers = document.getElementById('line-numbers');
const diffBody = document.getElementById('diff-body');

function startTest() {
    typingArea.value = '';
    typingArea.classList.remove('hidden');
    starterText.classList.add('hidden');
    typingArea.focus();
    resultsDiv.classList.add('hidden');
    diffView.classList.add('hidden');
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

    timeTakenSpan.innerText = timeTaken.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    resultsDiv.classList.remove('hidden');
    typingArea.classList.add('hidden');
    const formattedTime = (timeTaken / 1000).toFixed(3);
    timerDisplay.innerText = `${formattedTime}s`;

    const refWords = displayText.split(/\s+/).filter(w => w.length > 0);
    const typedWords = typedText.split(/\s+/).filter(w => w.length > 0);

    // **NEW**: Use the robust LCS algorithm for diffing and mistake counting.
    const { mistakesCount, diffHtml } = calculateFairDiffLCS(refWords, typedWords);

    // Accuracy is based on the number of correct words vs. total reference words.
    const correctWords = refWords.length - mistakesCount;
    const accuracy = Math.max(0, (correctWords / refWords.length) * 100);
    const formattedAccuracy = accuracy.toFixed(2);
    accuracySpan.innerText = formattedAccuracy;

    // Score Calculation
    const decimalAccuracy = accuracy / 100;
    const score = ((1 / timeTaken) * Math.pow(decimalAccuracy, 8)) * 1000000;
    scoreSpan.innerText = score.toFixed(2);

    // Render the results from the new algorithm.
    diffBody.innerHTML = diffHtml;
    diffMistakes.innerText = mistakesCount;
    diffFixes.innerText = correctWords;
    diffAccuracy.innerText = formattedAccuracy + '%';
    lineNumbers.innerHTML = '1';
    diffView.classList.remove('hidden');
    diffView.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function cleanWord(word) {
    return word.toLowerCase().replace(/[^a-z0-9]/g, '');
}

/**
 * **NEW ALGORITHM: Longest Common Subsequence (LCS) based diff**
 * This function implements a dynamic programming approach to find the optimal
 * alignment between two sequences of words, making it resilient to insertions
 * and deletions (the "word shifting" problem).
 *
 * @param {string[]} refWords - The array of reference words.
 * @param {string[]} typedWords - The array of typed words.
 * @returns {{mistakesCount: number, diffHtml: string}}
 */
function calculateFairDiffLCS(refWords, typedWords) {
    // 1. Build the DP table to find the length of the longest common subsequence.
    const dp = Array(refWords.length + 1).fill(null).map(() => Array(typedWords.length + 1).fill(0));
    for (let i = 1; i <= refWords.length; i++) {
        for (let j = 1; j <= typedWords.length; j++) {
            if (cleanWord(refWords[i - 1]) === cleanWord(typedWords[j - 1])) {
                dp[i][j] = dp[i - 1][j - 1] + 1;
            } else {
                dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
            }
        }
    }

    // 2. Backtrack through the table to reconstruct the diff.
    const diff = [];
    let i = refWords.length, j = typedWords.length;
    while (i > 0 || j > 0) {
        if (i > 0 && j > 0 && cleanWord(refWords[i - 1]) === cleanWord(typedWords[j - 1])) {
            diff.unshift({ type: 'unchanged', word: typedWords[j - 1] });
            i--;
            j--;
        } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
            diff.unshift({ type: 'added', word: typedWords[j - 1] });
            j--;
        } else if (i > 0) {
            diff.unshift({ type: 'removed', word: refWords[i - 1] });
            i--;
        }
    }

    // 3. Process the diff to count mistakes and generate HTML.
    let mistakesCount = 0;
    let diffHtml = '';
    for (let k = 0; k < diff.length; k++) {
        const current = diff[k];
        const next = diff[k + 1];

        if (current.type === 'unchanged') {
            diffHtml += `<span class="diff-unchanged">${current.word} </span>`;
        } else if (current.type === 'removed' && next && next.type === 'added') {
            // A substitution (e.g., wrong spelling) counts as one mistake.
            mistakesCount++;
            diffHtml += `<span class="diff-mistake">${next.word}</span> `;
            diffHtml += `<span class="diff-removed" style="font-size: 0.8em; opacity: 0.6;">(${current.word})</span> `;
            k++; // Skip the next item as it's part of the substitution.
        } else if (current.type === 'removed') {
            // A deletion counts as one mistake.
            mistakesCount++;
            diffHtml += `<span class="diff-removed">${current.word}</span> `;
        } else if (current.type === 'added') {
            // An insertion counts as one mistake.
            mistakesCount++;
            diffHtml += `<span class="diff-added">${current.word}</span> `;
        }
    }

    return { mistakesCount, diffHtml: diffHtml.trim() };
}

// --- Event Listeners (Unchanged) ---

startBtn.addEventListener('click', startTest);

typingArea.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        event.preventDefault();
        if (!startTime) {
            startTest();
        } else {
            const endTime = performance.now();
            const elapsed = endTime - startTime;
            finishTest(elapsed);
        }
    }
});

document.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && !startTime && document.activeElement !== typingArea) {
        event.preventDefault();
        startTest();
    }
});

['copy', 'cut', 'contextmenu', 'selectstart', 'select'].forEach(event => {
    typingArea.addEventListener(event, (e) => e.preventDefault());
});

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
