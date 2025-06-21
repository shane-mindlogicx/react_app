
export enum Theme {
  Light = 'light',
  Dark = 'dark',
}

export interface User {
  id: string;
  fullName: string;
  email: string;
  mobileNumber?: string;
  address?: string;
  avatarUrl?: string;
}

export interface AudioContent {
  id: string;
  title: string;
  artist: string;
  duration: string; // e.g., "3:45"
  coverArtUrl: string;
  category: string;
  audioUrl: string; // mock URL
  isFavorite?: boolean;
}

export interface Playlist {
  id: string;
  name: string;
  audioIds: string[];
  coverArtUrl?: string; // Could be auto-generated from audio covers
}

export enum SubscriptionTier {
  Daily = "Daily",
  Weekly = "Weekly",
  Monthly = "Monthly",
  Quarterly = "Quarterly",
  Yearly = "Yearly",
}

export interface SubscriptionPlan {
  tier: SubscriptionTier;
  price: string; // e.g., "$4.99"
  description: string;
  isPopular?: boolean;
  isBestValue?: boolean;
}

export interface Reminder {
  id: string;
  audioId: string;
  time: string; // "HH:MM"
  timeZone: string;
  alertBefore: string; // "10 min", "1 hour"
  repetitionType: 'daily_for_x_days' | 'every_day_indefinite' | 'selected_days';
  repetitionValue?: number | string[]; // X days or ['M', 'T', 'W']
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: Date;
}

export interface GroundingChunk {
  web?: {
    uri: string;
    title: string;
  };
  // Other types of chunks can be added here if needed
}

export interface GroundingMetadata {
  groundingChunks?: GroundingChunk[];
  // Other grounding metadata fields
}
