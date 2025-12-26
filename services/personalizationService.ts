
import { BodyMeasurements, UserPreferences } from "../types";

export const generateInitialRecommendations = (measurements: BodyMeasurements, preferences: UserPreferences) => {
  // Mock logic for personalization Step 5
  // In a real app, this would use the Gemini API or a matching algorithm
  
  const cats = ['tops', 'one-piece'];
  if (preferences.style_preferences.includes('sport')) cats.push('bottoms');
  
  return {
    categories: cats,
    brands: ['X-LABS', 'NEURAL_STORM', 'VOID_VOID'],
    items: ['Cyber-Biker Jacket', 'Neural-Mesh Tee', 'Glass-Fiber Tote']
  };
};
