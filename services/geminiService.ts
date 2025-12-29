
import { GoogleGenAI, Type } from "@google/genai";
import { DrugInfo } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

const DRUG_INFO_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    name: { type: Type.STRING, description: "Official name of the drug" },
    activeIngredients: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "List of active pharmacological ingredients"
    },
    indication: { type: Type.STRING, description: "What the medicine treats" },
    dosageGuidance: { type: Type.STRING, description: "Standard frequency and administration" },
    demographics: {
      type: Type.OBJECT,
      properties: {
        pediatric: { type: Type.STRING },
        adult: { type: Type.STRING },
        geriatric: { type: Type.STRING }
      },
      required: ["pediatric", "adult", "geriatric"]
    },
    contraindications: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "People who should not take this"
    },
    confidenceScore: { type: Type.NUMBER, description: "Percentage confidence in identification (0-1)" },
    physicalDescription: {
      type: Type.OBJECT,
      properties: {
        shape: { type: Type.STRING },
        color: { type: Type.STRING },
        imprint: { type: Type.STRING }
      },
      required: ["shape", "color", "imprint"]
    }
  },
  required: [
    "name", 
    "activeIngredients", 
    "indication", 
    "dosageGuidance", 
    "demographics", 
    "contraindications", 
    "confidenceScore", 
    "physicalDescription"
  ]
};

export async function analyzePillImage(base64Image: string): Promise<DrugInfo> {
  const model = "gemini-3-pro-preview";
  
  const prompt = `
    ACT AS A MEDICAL PHARMACEUTICAL EXPERT.
    Analyze this image of a pill or medication bottle.
    
    TASKS:
    1. OCR: Extract any text from the bottle label or blister pack (Name, Dosage, NDC).
    2. VISUAL CLASSIFICATION: Identify the pill by its physical characteristics:
       - Shape (e.g., Round, Oval, Capsule, Hexagonal)
       - Color (e.g., White, Blue/Yellow bicolor)
       - Imprint Code (e.g., L484, M365)
    3. DATA RETRIEVAL: Search for this medication in medical databases like OpenFDA, RxNav, and DailyMed.
    
    Provide a detailed analysis based on the schema provided.
    If the identification is uncertain, ensure the confidenceScore reflects this.
    If multiple items are found, focus on the primary medication shown.
  `;

  const response = await ai.models.generateContent({
    model: model,
    contents: {
      parts: [
        { text: prompt },
        {
          inlineData: {
            mimeType: "image/jpeg",
            data: base64Image
          }
        }
      ]
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: DRUG_INFO_SCHEMA,
      thinkingConfig: { thinkingBudget: 2000 }
    }
  });

  const resultText = response.text;
  if (!resultText) {
    throw new Error("Failed to extract data from Gemini response.");
  }

  return JSON.parse(resultText) as DrugInfo;
}
