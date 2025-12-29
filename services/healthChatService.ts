
import { GoogleGenAI } from "@google/genai";
import { Language } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export async function getHealthAdvice(message: string, lang: Language) {
  // Use Flash for speed
  const model = "gemini-3-flash-preview";
  
  const systemInstruction = `
    ACT AS A MEDICAL ANALYSER.
    LANGUAGE: Respond strictly in ${lang === 'hi' ? 'Hindi' : lang === 'ta' ? 'Tamil' : lang === 'te' ? 'Telugu' : 'English'}.
    
    CONCISENESS RULES:
    1. USE BULLET POINTS ONLY. 
    2. NO LONG PARAGRAPHS. 
    3. BE BRIEF. ONLY IMPORTANT INFO.
    
    STRUCTURE:
    - Condition: [Name]
    - Precautions: [Short list]
    - Tips: [Short list]
    - Remedies: [Short list]
    
    WARNING: Always end with "Consult a doctor."
  `;

  const chat = ai.chats.create({
    model: model,
    config: {
      systemInstruction,
      temperature: 0.5,
      thinkingConfig: { thinkingBudget: 0 } // Disable thinking for max speed
    },
  });

  const response = await chat.sendMessage({ message });
  return response.text;
}
