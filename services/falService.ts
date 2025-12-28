
const FAL_KEY = "98cb98f4-9629-4700-b79d-876c35a284b4:b0477d375ca05c4cf9310890ab2b9fd2";
const ENDPOINT = "fal-ai/kling/v1-5/kolors-virtual-try-on";

const convertUrlToBase64 = async (url: string): Promise<string> => {
  if (url.startsWith('data:')) return url;
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Image fetch failed: ${response.statusText}`);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error("Base64 conversion failed"));
      reader.readAsDataURL(blob);
    });
  } catch (e) {
    console.error("Critical Image Error:", url, e);
    return url;
  }
};

export const performTryOn = async (personImage: string, garmentImage: string, category: string): Promise<string> => {
  try {
    const [hBase64, gBase64] = await Promise.all([
      convertUrlToBase64(personImage),
      convertUrlToBase64(garmentImage)
    ]);

    const response = await fetch(`https://fal.run/${ENDPOINT}`, {
      method: "POST",
      headers: {
        "Authorization": `Key ${FAL_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        human_image_url: hBase64,
        garment_image_url: gBase64,
        category: category === 'tops' ? 'upper_body' : category === 'bottoms' ? 'lower_body' : 'dress'
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `Synthesis failed: ${response.statusText}`);
    }

    const data = await response.json();
    const resultUrl = data.image?.url || data.result?.url || "";
    
    if (!resultUrl) throw new Error("API returned no image URL");
    
    return resultUrl;
  } catch (error: any) {
    console.error("Fal.ai Service Error:", error);
    throw new Error(error.message || "Neural synthesis failed at core level.");
  }
};
