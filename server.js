
const express = require("express");
const cors = require("cors");
const Groq = require("groq-sdk");
require("dotenv").config();

const app = express();
app.use(express.static(__dirname));
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

app.get("/", (req, res) => {
  res.send("AI Science Tutor Server is running!");
});

app.post("/api/chat", async (req, res) => {
  try {
    const { message, subject } = req.body;

    if (!message) {
      return res.status(400).json({
        error: "Please enter a question."
      });
    }

    const allowedSubjects = [
      "Chemistry",
      "Biology",
      "Physics",
      "Mathematics",
      "English"
    ];

    const selectedSubject = allowedSubjects.includes(subject)
      ? subject
      : "General Science";

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: `You are a friendly and intelligent AI tutor.
          Your job is to teach students ${selectedSubject}.
          Explain concepts step by step using simple English.
          Give examples where necessary.
          Help students understand rather than just memorise.
          If a question involves calculations, show the steps.
          Be encouraging and accurate.`
        },
        {
          role: "user",
          content: message
        }
      ],
      temperature: 0.7,
      max_tokens: 1500
    });

    res.json({
      reply: completion.choices[0].message.content
    });

  } catch (error) {
    console.error("AI Error:", error.message);

    res.status(500).json({
      error: "Sorry, something went wrong. Please try again."
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`AI Tutor running on port ${PORT}`);
});
