// controllers/aiController.js
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const askGemini = async (req, res) => {
  try {
    const { question, model = "gemini-3-flash-preview" } = req.body;

    if (!question || question.trim().length === 0) {
      return res.status(400).json({ error: "Question is required" });
    }

    const modelInstance = genAI.getGenerativeModel({ model });
    
    const result = await modelInstance.generateContent(question);
    const response = await result.response;
    const text = response.text();

    res.json({
      success: true,
      answer: text,
      question: question
    });

  } catch (error) {
    console.error("Gemini API Error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to get response from AI",
      details: error.message
    });
  }
};