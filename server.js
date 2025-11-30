// server.js – TESZT VERZIÓ OPENAI NÉLKÜL
const express = require("express");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 10000; // Render a PORT változóval dolgozik

app.use(cors());
app.use(express.json());

// Egyszerű teszt endpoint
app.get("/", (req, res) => {
  res.send("Chat backend running (TEST)");
});

// Chat endpoint – MOST MÉG NINCS OPENAI, CSAK FIX VÁLASZ
app.post("/api/chat", async (req, res) => {
  const { history } = req.body;

  // minimális ellenőrzés
  if (!history || !Array.isArray(history) || history.length === 0) {
    return res.status(400).json({ error: "history mező hiányzik vagy üres" });
  }

  const lastUserMessage = history.slice(-1)[0]?.content || "";

  const reply =
    "This is a TEST reply from the server. You wrote: \"" +
    lastUserMessage +
    "\". The OpenAI part is not yet enabled.";

  res.json({ reply });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port} (TEST MODE)`);
});

