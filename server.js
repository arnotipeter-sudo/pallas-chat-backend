// server.js – TESZT VERZIÓ OPENAI NÉLKÜL
const express = require("express");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 10000; // Render a PORT változót adja

app.use(cors());
app.use(express.json());

// Egyszerű teszt endpoint
app.get("/", (req, res) => {
  res.send("Chat backend running (TEST MODE, NO OPENAI)");
});

// Chat endpoint – NINCS OpenAI, CSAK FIX VÁLASZ
app.post("/api/chat", async (req, res) => {
  const { history } = req.body;

  if (!history || !Array.isArray(history) || history.length === 0) {
    return res.status(400).json({ error: "history mező hiányzik vagy üres" });
  }

  const lastUserMessage = history.slice(-1)[0]?.content || "";

  const reply =
    'TEST VÁLASZ a szervertől. Ezt írtad: "' +
    lastUserMessage +
    '". Az OpenAI még NINCS bekapcsolva, csak a kapcsolatot teszteljük.';

  res.json({ reply });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port} (TEST MODE)`);
});
