import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Health check
app.get("/api/health", (req, res) => res.json({ ok: true }));

// POST /api/chat { model, messages: [{role, content}, ...] }
app.post("/api/chat", async (req, res) => {
  try {
    const { model = "gpt-3.5-turbo", messages = [] } = req.body || {};

    const response = await client.responses.create({
      model,
      input: messages.map(({ role, content }) => ({ role, content })),
    });

    const text = response.output_text ?? "(no output_text)";
    res.json({ text });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err?.message || "Unknown error" });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`✅ API ready on http://localhost:${PORT}`));