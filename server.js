// server.js – VÉGLEGES VERZIÓ OPENAI-VAL, EGYSZERŰ SZINTAXISSAL
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

// Healthcheck
app.get("/", (req, res) => {
  res.send("Chat backend running (OPENAI MODE, SIMPLE)");
});

// Chat endpoint
app.post("/api/chat", async (req, res) => {
  const { history } = req.body;

  if (!history || !Array.isArray(history) || history.length === 0) {
    return res.status(400).json({ error: "history mező hiányzik vagy üres" });
  }

  // messages tömb felépítése spread nélkül
  const messages = [
    {
      role: "system",
      content:
        "You are a friendly English conversation tutor. " +
        "Speak only in English. Use simple vocabulary and short sentences. " +
        "The student is around B1 level. If the student makes a mistake, " +
        "correct it gently and provide a better version."
    }
  ];

  for (const m of history) {
    messages.push({
      role: m.role === "assistant" ? "assistant" : "user",
      content: m.content || ""
    });
  }

  try {
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini", // olcsó, gyors modell
      messages,
      temperature: 0.7
    });

    const reply =
      completion.choices &&
      completion.choices[0] &&
      completion.choices[0].message &&
      completion.choices[0].message.content
        ? completion.choices[0].message.content
        : "Sorry, I could not generate a reply.";

    res.json({ reply });
  } catch (error) {
    console.error("OpenAI hiba:", error?.response?.data || error.message || error);

    res.status(500).json({
      error: "OpenAI error",
      detail: error?.response?.data || error.message || String(error)
    });
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port} (OPENAI MODE, SIMPLE)`);
});
