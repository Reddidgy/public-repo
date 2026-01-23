# Simple Typing speed check - Application Specification

## Application Overview

A minimalist high-precision web application designed to measure user typing speed in Words Per Minute (WPM) and total time taken. It features a real-time timer and a specific Biblical prose for testing user accuracy and speed.

## Technology Stack

Frontend:
- Vanilla HTML5 (Structure)
- Vanilla CSS3 (Styling & Responsive Design)
- Vanilla JavaScript (Core Logic & High-precision Timing)

Backend:
- None (Fully client-side solution)

## Implemented Features

- Real-time High-precision Timer: Displays elapsed time with millisecond precision using `performance.now()`.
- WPM Calculation: Calculates speed based on typed words and time taken.
- Accuracy Tracking: Calculates typing accuracy as a percentage (case-insensitive), excluding special characters (`[`, `]`, `}`, `:`, `.`, `_`, `{`, `-`, `"`, `'`, ```).
- Score Calculation: Computes a final score based on the formula `Score = ( (1 / Time) * (Accuracy ^ 8) ) * 10,00000`.
- Interactive UI: Toggles textarea visibility between idle and active states.
- Anti-cheat Measures: Disables copy, cut, right-click, and text selection globally across the UI. Pasting into the typing area is allowed.
- Starter Instruction: Hidden once the test begins to reduce clutter.
- Input Validation: Specifically prevents newline character in textarea to ensure consistent test finishing via Enter key.

## Project Structure

- `index.html`: Main application entry point and structure.
- `style.css`: Modern, clean UI styling with Flexbox and responsive container.
- `script.js`: Core application logic, event handlers, and timing mechanisms.
- `README.md`: Developer/User-facing documentation.

## UI Objects

- Container: Centered white box holding all UI elements.
- Display Text: Box containing the reference text to be typed.
- Starter Text: Instructional prompt for the user.
- Typing Area: Textarea for user input, hidden by default.
- Timer Display: Bold, large real-time display for elapsed time.
- Start Button: Triggers the test start.
- Results Div: A unified Results Card featuring a large, prominent Performance Score and a detailed Accuracy percentage. The raw time taken in milliseconds is hidden.
- Source Code Link: A stylized GitHub link block providing direct access to the project repository.
