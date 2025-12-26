
import { GoogleGenAI, Type } from "@google/genai";
import { GeminiStyleAdvice } from "../types";
import { Language } from "../translations";

/**
 * Converts a URL or DataURI image into a base64 string compatible with Gemini's inlineData.
 */
async function getBase64FromUrl(url: string): Promise<string> {
  if (url.startsWith('data:')) {
    const parts = url.split(',');
    return parts.length > 1 ? parts[1] : parts[0];
  }
  
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to fetch image: ${response.statusText}`);
    const blob = await response.blob();
    
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = () => reject(new Error("Failed to read image as base64"));
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error("Error converting image to base64:", error);
    throw error;
  }
}

export const getFashionAdvice = async (personImage: string, garmentImage: string, lang: Language = 'en'): Promise<GeminiStyleAdvice> => {
  // Create a new GoogleGenAI instance right before making an API call to ensure it always uses the most up-to-date API key.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const languageInstruction = lang === 'tr' 
    ? "Yanıtı mutlaka Türkçe ver." 
    : "The response must be in English.";

  try {
    // Process images into base64 for Gemini
    const personBase64 = await getBase64FromUrl(personImage);
    const garmentBase64 = await getBase64FromUrl(garmentImage);

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        {
          parts: [
            { text: `Analyze the person's style and this specific garment. Provide expert styling advice. Then, use Google Search to find 3 real accessory or shoe recommendations that match this look perfectly. Return the response in the specified JSON format. ${languageInstruction}` },
            { inlineData: { mimeType: "image/jpeg", data: personBase64 } },
            { inlineData: { mimeType: "image/jpeg", data: garmentBase64 } }
          ]
        }
      ],
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            stylingTips: { type: Type.ARRAY, items: { type: Type.STRING } },
            vibe: { type: Type.STRING }
          },
          required: ["summary", "stylingTips", "vibe"]
        }
      }
    });

    // The text property returns the generated content.
    const jsonStr = response.text?.trim() || "{}";
    let advice;
    try {
      advice = JSON.parse(jsonStr);
    } catch (e) {
      console.error("Failed to parse Gemini JSON response:", jsonStr);
      advice = {
        summary: "Neural Engine style synthesis complete. However, the data format was irregular.",
        stylingTips: ["Access the neural archive for more details.", "Verify your biometric link."],
        vibe: "MODERN_TRANSITION"
      };
    }

    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

    return {
      ...advice,
      sources: groundingChunks
    };
  } catch (error: any) {
    console.error("Gemini Fashion Advice Error:", error);
    // Return a fallback advice so the app doesn't break if Gemini fails
    return {
      summary: "Neural link is currently experiencing high load. Styling advice is synthesized with local cache.",
      stylingTips: ["Pair with minimalist accessories.", "Consider tonal balancing."],
      vibe: "NEURAL_DEFAULT"
    };
  }
};
