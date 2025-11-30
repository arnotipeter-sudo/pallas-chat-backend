// server.js – VÉGLEGES VERZIÓ OPENAI-VAL
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const OpenAI = require("openai");

dotenv.config();

const app = express();
const port = process.env.PORT || 10000; // Render a PORT változót adja

app.use(cors());
app.use(express.json());

// OpenAI kliens
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Egyszerű healthcheck
app.get("/", (req, res) => {
  res.send("Chat backend running (OPENAI MODE)");
});

// Chat endpoint – Itt lép be az OpenAI
app.post("/api/chat", async (req, res) => {
  const { history } = req.body;

  if (!history || !Array.isArray(history) || history.length === 0) {
    return res.status(400).json({ error: "history mező hiányzik vagy üres" });
  }

  // A frontendes history → OpenAI messages formátum
  const messages = [
    {
      role: "system",
      content:
        "You are a friendly English conversation tutor. " +
        "Speak only in English. Use simple vocabulary and short sentences. " +
        "The student is around B1 level. If the student makes a mistake, " +
        "correct it gently and provide a better version."
    },
    ...history.map((m)
