
export type GarmentCategory = 'tops' | 'bottoms' | 'one-piece';
export type Scenario = 'studio' | 'urban' | 'nature' | 'party';
export type FitPreference = 'slim' | 'regular' | 'relaxed';
export type ProfileVisibility = 'public' | 'brands' | 'private';

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
  id: string; // Database UUID
  email: string;
  name: string;
  role: 'user' | 'admin' | 'brand';
  bio?: string;
  avatar_url?: string; // Matched with SQL schema
  visibility: ProfileVisibility;
  followers: string[];
  following: string[];
}

export interface Comment {
  id: string;
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

export interface GeminiStyleAdvice {
  summary: string;
  stylingTips: string[];
  vibe: string;
}

export interface LookbookEntry {
  id: string;
  personImage: string;
  garmentImage: string;
  resultImage: string;
  date: number;
  advice?: GeminiStyleAdvice;
}

export interface ClosetItem extends LookbookEntry {
  isFavorite: boolean;
  tags: string[];
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
  votes: number;
  comments: Comment[];
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
  targetUser: User | null; // Profile viewing
  personImage: string | null;
  garmentImage: string | null;
  resultImage: string | null;
  category: GarmentCategory;
  scenario: Scenario;
  isLoading: boolean;
  status: 'idle' | 'uploading' | 'processing' | 'completed' | 'error';
  error: string | null;
  lookbook: LookbookEntry[];
  closet: ClosetItem[];
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
