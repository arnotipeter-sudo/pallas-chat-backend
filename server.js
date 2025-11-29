// server.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const OpenAI = require("openai");

dotenv.config();

const app = express();
const port = process.env.PORT || 10000; // Render a PORT változót adja meg

app.use(cors());
app.use(express.json());

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Egyszerű health-check a főoldalon
app.get("/", (req, res) => {
  res.send("Chat backend running");
});

app.post("/api/chat", async (req, res) => {
  const { history } = req.body;

  if (!history || !Array.isArray(history)) {
    return res.status(400).json({ error: "history mező hiányzik vagy nem tömb" });
  }

  try {
    const response = await client.responses.create({
      model: "gpt-4.1-mini",
      instructions:
        "You are a friendly English conversation tutor. " +
        "Speak only in English. " +
        "Your student is around B1 level. " +
        "Use simple vocabulary and short sentences. " +
        "If the student makes a mistake, correct it gently and give a better version.",
      input: history
    });

    const reply = response.output_text;
    res.json({ reply });
  } catch (error) {
    console.error("OpenAI hiba:", error);
    res.status(500).json({
      error: "Hiba történt az OpenAI hívás során. Ellenőrizd az API-kulcsot és a modell beállításokat."
    });
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

