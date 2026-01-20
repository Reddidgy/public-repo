# Typing Speed Check Application

This is a simple frontend application to measure typing speed (WPM) and time taken to type a specific text.

## Features

- Display text to type.
- Timer with millisecond precision (0-60 seconds).
- WPM calculation based on the formula: `WPM = (Number of words typed / Time taken in minutes)`.

## Setup

1. Open `index.html` in any modern web browser.
2. Click the "Start" button or press "Enter" to begin.
3. Type the text in the textarea.
4. Press "Enter" specifically in the textarea to finish the test.

## Technical Details

- Built using Vanilla HTML, CSS, and JavaScript.
- No external dependencies.
- Timer uses `performance.now()` for high-precision timing.
