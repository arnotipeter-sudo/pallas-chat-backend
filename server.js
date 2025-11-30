// server.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const OpenAI = require("openai");

dotenv.config();

const app = express();
const port = process.env.PORT || 10000; // Render a PORT environment változót adja

app.use(cors());
app.use(express.json());

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Egyszerű teszt a főoldalon
app.get("/", (req, res) => {
  res.send("Chat backend running");
});

// Chat endpoint
app.post("/api/chat", async (req, res) => {
  const { history } = req.body;

  if (!history || !Array.isArray(history) || history.length === 0) {
    return res.status(400).json({ error: "history mező hiányzik vagy üres" });
  }

  // Csak az utolsó user üzenetet küldjük a modellnek – egyszerű, stabil megoldás
  const lastUserMessage = history
    .filter((m) => m.role === "user")
    .slice(-1)[0]?.content;

  if (!lastUserMessage) {
    return res.status(400).json({ error: "Nincs user üzenet a history-ban" });
  }

  try {
    const response = await client.responses.create({
      model: "gpt-4.1-mini",
      input: lastUserMessage,
      instructions:
        "You are a friendly English conversation tutor. " +
        "Speak only in English. " +
        "Use simple vocabulary and short sentences. " +
        "The student is around B1 level. " +
        "If the student makes a mistake, correct it gently and provide a better version."
    });

    // Egyszerű szövegkimenet
    const reply = response.output_text;
    res.json({ reply });
  } catch (error) {
    console.error("OpenAI hiba:", error?.response?.data || error.message || error);

    res.status(500).json({
      error: "Hiba történt az OpenAI hívás során a szerveren."
    });
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

