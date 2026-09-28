// Travel With You - Core TypeScript Type Definitions

export type PlaceCategory = 
  | 'theatres'
  | 'cafes'
  | 'restaurants'
  | 'street_food'
  | 'study_spots'
  | 'parks_nature'
  | 'viewpoints'
  | 'entertainment'
  | 'cultural_temples'
  | 'shopping'
  | 'weekend_trips'
  | 'photo_spots';

export interface CategoryInfo {
  id: PlaceCategory;
  name: string;
  emoji: string;
  description: string;
  tagline: string;
  badgeColor: string;
}

export interface Place {
  id: string;
  name: string;
  category: PlaceCategory;
  description: string;
  address: string;
  area: string;
  city: string;
  latitude: number;
  longitude: number;
  priceLevel: number; // 0=Free, 1=<₹150, 2=₹150-₹350, 3=₹350-₹700, 4=₹700+
  approxCostForOne: number;
  rating: number;
  reviewCount: number;
  openingTime: string;
  closingTime: string;
  imageUrl: string;
  hasWifi: boolean;
  hasCharging: boolean;
  isQuiet: boolean;
  isOutdoor: boolean;
  isStudentFriendly: boolean;
  studentPerks: string[];
  distanceKm?: number;
  safetyNotes?: string;
}

export interface LocationState {
  city: string;
  area: string;
  latitude: number;
  longitude: number;
  isDetected: boolean;
}

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  collegeName?: string;
  city: string;
  avatarUrl?: string;
  preferredVibe?: string[];
}

export type ActiveTab = 
  | 'home'
  | 'explore'
  | 'map'
  | 'planner'
  | 'budget'
  | 'saved'
  | 'memories'
  | 'profile';

export type AuthMode = 'login' | 'signup' | null;
