
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: "dummy_key_for_now" });

export const parseWhatsAppMessage = async (text: string) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Parse this WhatsApp message into a structured assignment JSON. If info is missing, guess logically or leave null. Message: "${text}"`,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          subject: { type: Type.STRING },
          description: { type: Type.STRING },
          deadlineDate: { type: Type.STRING, description: "YYYY-MM-DD format" },
          professor: { type: Type.STRING },
          tags: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ['title', 'subject', 'deadlineDate']
      }
    }
  });

  return JSON.parse(response.text || '{}');
};
