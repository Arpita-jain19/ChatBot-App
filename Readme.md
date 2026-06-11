# AI ChatBot App

A modern AI-powered chatbot built with the MERN stack and Groq API. The application provides a clean chat experience with real-time AI responses, markdown support, voice input, chat management, and streaming responses.

## Features

### Core Chat Features

* AI-powered conversations using Groq API
* Real-time streaming responses
* Create new chats
* Persistent chat history
* Responsive chat interface
* Auto-scroll to latest messages

### Message Features

* Copy messages with visual "Copied" feedback
* Markdown rendering support
* Code block rendering
* User and AI message separation
* Loading and typing indicators

### Voice Features

* Speech-to-text input
* Browser speech recognition support

### UI/UX Features

* Clean modern interface
* Dynamic message containers
* Smooth scrolling experience
* Mobile-friendly design

### State Management

* Local storage chat persistence
* Multiple conversation support
* Chat session management

### Security

* Environment variable support
* API keys stored securely using `.env`
* `.env` excluded from version control

## Upcoming Features

* Stop Generating button
* Regenerate Response
* Dark/Light Theme Toggle
* Chat Search
* Export Chat as PDF
* Syntax Highlighting for Code Blocks
* Chat Rename Functionality
* Image Upload & Analysis
* Message Reactions (Like/Dislike)

## Tech Stack

### Frontend

* React
* Vite
* CSS

### Backend

* Node.js
* Express.js

### AI

* Groq API

## Installation

### Clone Repository

```bash
git clone <repository-url>
cd AIChatBotApp
```

### Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file:

```env
GROQ_API_KEY=your_api_key_here
```

Start backend:

```bash
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

## Project Structure

```text
AIChatBotApp/
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── backend/
│   ├── server.js
│   ├── routes/
│   ├── controllers/
│   ├── package.json
│   └── .env
│
├── .gitignore
└── README.md
```

## Environment Variables

```env
GROQ_API_KEY=your_api_key
```

Never commit your `.env` file to GitHub.

## Author

Arpita Jain

## License

MIT License
