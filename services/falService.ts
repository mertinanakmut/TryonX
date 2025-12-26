
const FAL_KEY = "98cb98f4-9629-4700-b79d-876c35a284b4:b0477d375ca05c4cf9310890ab2b9fd2";
const ENDPOINT = "fal-ai/kling/v1-5/kolors-virtual-try-on";

/**
 * Maps our internal GarmentCategory to the Kling v1.5 API expected values.
 * API expects: 'upper_body', 'lower_body', 'dress'
 */
const mapCategory = (category: string): string => {
  switch (category) {
    case 'tops': return 'upper_body';
    case 'bottoms': return 'lower_body';
    case 'one-piece': return 'dress';
    default: return 'upper_body';
  }
};

/**
 * Ensures the image input is in a format accepted by Fal.ai.
 * If it's a URL, returns as is.
 * If it's already a data URI, returns as is.
 * If it's a raw base64 string, prepends the data URI prefix.
 */
const formatImageInput = (input: string): string => {
  if (input.startsWith('http://') || input.startsWith('https://')) {
    return input;
  }
  if (input.startsWith('data:')) {
    return input;
  }
  // Fallback assuming it's a raw base64 string
  return `data:image/jpeg;base64,${input}`;
};

export const performTryOn = async (personBase64: string, garmentBase64: string, category: string): Promise<string> => {
  try {
    const humanImage = formatImageInput(personBase64);
    const garmentImage = formatImageInput(garmentBase64);

    const response = await fetch(`https://fal.run/${ENDPOINT}`, {
      method: "POST",
      headers: {
        "Authorization": `Key ${FAL_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        human_image_url: humanImage,
        garment_image_url: garmentImage,
        category: mapCategory(category)
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      let errMessage = "Fal.ai error occurred.";
      try {
        const errData = JSON.parse(errText);
        // Handle the case where detail might be an array or object
        if (typeof errData.detail === 'string') {
          errMessage = errData.detail;
        } else if (Array.isArray(errData.detail)) {
          errMessage = errData.detail.map((d: any) => d.msg || JSON.stringify(d)).join(', ');
        } else if (errData.detail) {
          errMessage = JSON.stringify(errData.detail);
        } else if (errData.message) {
          errMessage = errData.message;
        }
      } catch (e) {
        errMessage = errText || errMessage;
      }
      throw new Error(errMessage);
    }

    const data = await response.json();
    // Kling v1.5 VTO on Fal returns { image: { url: "..." } }
    const resultUrl = data.image?.url || data.result?.url || data.url || "";
    
    if (!resultUrl) {
      throw new Error("API response did not contain a result image URL.");
    }
    
    return resultUrl;
  } catch (error: any) {
    console.error("Fal.ai Service Error Detailed:", error);
    const msg = error.message || "An unknown error occurred during the try-on synthesis.";
    
    if (msg === 'Failed to fetch' || msg.includes('Load failed')) {
      throw new Error("Nöral sunucu bağlantı hatası. Lütfen ağınızı kontrol edin veya Fal.ai anahtarını doğrulayın.");
    }
    
    // Ensure we always return a string for the error display
    throw new Error(typeof msg === 'string' ? msg : JSON.stringify(msg));
  }
};
