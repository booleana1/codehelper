# **App Name**: CodeFixer

## Core Features:

- Code Input Area: Provides a large text area for users to paste their code snippets, ideally with syntax highlighting for better readability.
- Error Message Input: A dedicated field for users to input the error message they are encountering (e.g., stack trace or runtime/compiler message).
- Error Analysis: Analyzes the submitted code and error message using the Gemini API to generate:
- A clear explanation of the error
- Step-by-step guidance to fix it
- The corrected code
- An additional tip or best practice
- Analysis Output Display: Displays the analysis results in a structured and easily digestible format, with the corrected code visually emphasized.
- Analysis History: Maintains a history of previous analyses for authenticated users using anonymous Firebase Authentication, allowing them to review past debugging sessions.

## Style Guidelines:

- Primary Color: #ed145b Represents boldness, energy, and strong identity. Used for headers and key elements.
- Background Color: #161616 A dark background for a modern, tech-oriented feel.
- Accent Color: #ed145b A vibrant color for calls to action, highlights, and key buttons.
- Text Color: White Used for primary readability against the dark background.
- Clean, readable sans-serif fonts to ensure clarity in both code and explanations.
- Simple, intuitive icons representing different programming languages and error types, enhancing usability.
- Clean and well-organized, clear separation between input (code + error) and output (results), responsive for both desktop and mobile, dark mode by default for a developer-friendly interface