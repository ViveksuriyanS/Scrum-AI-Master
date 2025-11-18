<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1sIP9CMnM546fai7cUDgthStzbWDddbva

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`


# Scrum AI Master — README
Overview

Scrum AI Master is an autonomous Scrum management system built with Python, FastAPI, and AI agents. It accepts audio, video, or text updates from daily stand-ups, converts them into text using Google Speech-to-Text with diarization, summarizes key points, and automatically extracts actionable tasks.

The platform organizes work items into a task board with categories:

🆕 New

📋 To-Do

🔄 In-Progress

✔️ Completed

⛔ Blockers

Each new task generates a subtask and assigns ownership based on speaker identification. Monthly performance reports and weekly team digests are automatically generated and sent to distribution lists.

Key Features
🗣 Upload & Transcribe

Supports audio, video, and text uploads

Extracts audio via FFmpeg

Uses Google STT diarization to identify speakers

🧠 AI-Powered Summarization

Generates daily scrum summaries

Extracts To-Do, In-Progress, Completed, and Blockers

📌 Task Automation

Creates and updates task cards automatically

Assigns subtasks to members

Maintains historical records with timestamps

📊 Dashboard

Kanban-style UI with draggable task cards

Real-time updates and search

📨 Reporting & Notifications

Weekly summary emails

Monthly member performance evaluation

PR merge webhook triggers code-review agent

Tech Stack
Layer	Technology
Backend	FastAPI, Python 3.11
AI/LLM	OpenAI / Gemini / Local
Speech	Google Speech-to-Text (Diarization)
DB	PostgreSQL
Queue	Celery + Redis
UI	React / AI Studio UI
Deployment	Docker, GitHub Actions
Agent System
Agent	Responsibility
Ingest Agent	Processes uploads, extracts audio
Speech Agent	Performs diarized transcription
Summarizer Agent	Generates summary + structured tasks
Task Agent	Creates, updates, and syncs task cards
Notification Agent	Sends reports via email
Code Review Agent	Runs on PR merge events


How It Works

1️⃣ User uploads audio/video/text
2️⃣ System converts speech → transcript with speaker labels
3️⃣ AI generates daily summary & structured tasks
4️⃣ Tasks update dynamically in database and dashboard
5️⃣ Reports sent weekly; performance tracked monthly

Future Scope
1️⃣ AI Code Review Automation

After a task is marked as completed and linked to a Pull Request, the system will:

Fetch PR diff

Run static code checks / linting

Use an LLM to produce automated review feedback

Post results back to the PR or task card

2️⃣ Voice-First Scrum Interaction

Users will be able to:

Speak directly to the AI agent

Say: “Add a task: Fix deployment script, assign to Sam, due Friday”

AI will convert speech → task, categorize it, and assign ownership

Enable fully hands-free stand-up participation
