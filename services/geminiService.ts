
import { GoogleGenAI, Type } from "@google/genai";
import { GeminiStyleAdvice } from "../types";
import { Language } from "../translations";

async function getBase64FromUrl(url: string): Promise<string> {
  if (url.startsWith('data:')) {
    const parts = url.split(',');
    return parts.length > 1 ? parts[1] : parts[0];
  }
  
  try {
    const targetUrl = url.includes('unsplash.com') && !url.includes('fm=') 
      ? `${url}${url.includes('?') ? '&' : '?'}fm=jpg&q=80` 
      : url;

    const response = await fetch(targetUrl);
    if (!response.ok) throw new Error(`Fetch failed: ${response.status}`);
    const blob = await response.blob();
    
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        resolve(result.split(',')[1]);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error("Base64 Conversion Error:", error);
    throw error;
  }
}

// Fixed: Initialization must use process.env.API_KEY directly.
// Upgraded model to gemini-3-pro-preview for advanced multimodal styling analysis.
export const getFashionAdvice = async (personImage: string, garmentImage: string, lang: Language = 'en'): Promise<GeminiStyleAdvice> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const languageInstruction = lang === 'tr' ? "Yanıtı Türkçe ver." : "The response must be in English.";

  try {
    const [personBase64, garmentBase64] = await Promise.all([
      getBase64FromUrl(personImage),
      getBase64FromUrl(garmentImage)
    ]);

    // Fixed: Simplified the 'contents' structure to a single Content object for multimodal input.
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: {
        parts: [
          { text: `Analyze these images and provide expert styling advice in JSON. ${languageInstruction}` },
          { inlineData: { mimeType: "image/jpeg", data: personBase64 } },
          { inlineData: { mimeType: "image/jpeg", data: garmentBase64 } }
        ]
      },
      config: {
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

    // response.text is a property, not a method.
    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Gemini Advice Error:", error);
    return {
      summary: "Neural stylist offline. Biometric match looks optimal.",
      stylingTips: ["Pair with minimalist accessories.", "Check local store availability."],
      vibe: "MODERN_TRANSITION"
    };
  }
};
