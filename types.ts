
export type GarmentCategory = 'tops' | 'bottoms' | 'one-piece';
export type Scenario = 'studio' | 'urban' | 'nature' | 'party';
export type FitPreference = 'slim' | 'regular' | 'relaxed';
export type ProfileVisibility = 'public' | 'brands' | 'private';

/* Added GeminiStyleAdvice to fix missing exported member error */
export interface GeminiStyleAdvice {
  summary: string;
  stylingTips: string[];
  vibe: string;
}

/* Added BrandInsight to fix missing exported member error in InsightsDashboard */
export interface BrandInsight {
  totalTryOns: number;
  engagementRate: number;
  clonesCount: number;
  bodyTypeData: { type: string; percentage: number }[];
  topPairings: { item: string; frequency: number }[];
  productionRisk: {
    score: number;
    issue: string;
    description: string;
  };
}

export interface UserPreferences {
  style_preferences: string[];
  fit_preference: FitPreference;
  comfort_mode_enabled: boolean;
  data_consent: boolean;
  legal_version: string;
  onboarding_complete: boolean;
}

export interface BodyMeasurements {
  height: number;
  weight: number;
  chest: number;
  waist: number;
  hips: number;
  unit: 'metric' | 'imperial';
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin' | 'brand';
  bio?: string;
  avatar_url?: string;
  visibility: ProfileVisibility;
  followers: string[];
  following: string[];
  saved_posts?: string[]; // IDs of RunwayPosts or Lookbook entries saved
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  text: string;
  timestamp: number;
}

export interface BrandProduct {
  id: string;
  brandId: string;
  brandName: string;
  brandLogo: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  imageUrl: string;
  category: GarmentCategory;
  buyLink: string;
  likes: number;
  views: number;
  comments: Comment[];
  trendScore: number;
}

export interface LookbookEntry {
  id: string;
  personImage: string;
  garmentImage: string;
  resultImage: string;
  date: number;
  /* Updated advice to use the newly defined GeminiStyleAdvice interface */
  advice?: GeminiStyleAdvice;
}

export interface StyleChallenge {
  id: string;
  title: string;
  tag: string;
  description: string;
  rules: string[];
  linkedProductId: string;
  deadline: string;
  prize: string;
  participants: number;
  bannerImage: string;
}

export interface RunwayPost {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  resultImage: string;
  garmentImage: string;
  category: string;
  vibe: string;
  likes: number;
  liked_by: string[]; // List of user IDs
  saved_by: string[]; // List of user IDs
  comments: Comment[];
  created_at?: string;
}

export interface StyleArchitect {
  id: string;
  name: string;
  avatar: string;
  clones: number;
  votes: number;
  rank: number;
}

export interface TryOnState {
  view: 'landing' | 'home' | 'studio' | 'brand' | 'tech' | 'auth' | 'marketplace' | 'arena' | 'search' | 'user_profile';
  currentUser: User | null;
  targetUser: User | null;
  personImage: string | null;
  garmentImage: string | null;
  resultImage: string | null;
  category: GarmentCategory;
  scenario: Scenario;
  isLoading: boolean;
  status: 'idle' | 'uploading' | 'processing' | 'completed' | 'error';
  error: string | null;
  lookbook: LookbookEntry[];
  closet: any[];
  brandProducts: BrandProduct[];
  challenges: StyleChallenge[];
  runwayPosts: RunwayPost[];
  architects: StyleArchitect[];
  activeChallengeId: string | null;
  searchQuery: string;
  allUsers: User[];
  measurements: BodyMeasurements | null;
  preferences: UserPreferences | null;
}
