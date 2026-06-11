const express = require("express");
const cors = require("cors");
require("dotenv").config();
const axios = require("axios");

const app = express();

app.use(cors());
app.use(express.json());

/* =====================
   IN-MEMORY DATABASE
========================= */
let chats = [];

/* =========================
   TEST ROUTE
========================= */
app.get("/", (req, res) => {
    res.send("AI Chatbot Backend Running");
});

/* =========================
   CREATE NEW CHAT
========================= */
app.post("/chat/new", (req, res) => {
    const chat = {
        id: Date.now().toString(),
        title: "New Chat",
        messages: []
    };

    chats.push(chat);

    res.json(chat);
});

/* =========================
   GET ALL CHATS
========================= */
app.get("/chats", (req, res) => {
    res.json(chats);
});

/* =========================
   SEND MESSAGE TO CHAT (MOCK)
========================= */
app.post("/chat/:id/message", (req, res) => {
    const { id } = req.params;
    const { message } = req.body;

    const chat = chats.find(c => c.id === id);

    if (!chat) {
        return res.status(404).json({ error: "Chat not found" });
    }

    // user message
    chat.messages.push({ role: "user", text: message });

    // mock reply
    const reply = "AI: " + message;

    chat.messages.push({ role: "bot", text: reply });

    res.json(chat);
});

/* =========================
   GROQ CHAT ENDPOINT (REAL AI)
========================= */
app.post("/chat", async (req, res) => {
    const { message } = req.body;

    try {
        const response = await axios.post(
            "https://api.groq.com/openai/v1/chat/completions",
            {
                model: "llama-3.1-8b-instant",
                messages: [
                    { role: "user", content: message }
                ]
            },
            {
                headers: {
                    "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
                    "Content-Type": "application/json"
                }
            }
        );

        const reply = response.data.choices[0].message.content;

        res.json({ reply });

    } catch (error) {
        console.log("ERROR:", error.response?.data || error.message);
        res.status(500).json({ error: error.message });
    }
});

/* =========================
   START SERVER
========================= */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});