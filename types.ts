
export interface GroundingChunk {
  web?: {
    uri: string;
    title: string;
  };
  maps?: {
    placeId: string;
    title: string;
    uri: string;
    // Basic extraction of common maps fields
  };
}

export interface LandmarkData {
  id?: string;
  name: string;
  description: string;
  sources: GroundingChunk[];
  mapInfo?: {
    rating?: string;
    address?: string;
    uri?: string;
  };
  nearbyPlaces?: GroundingChunk[]; 
  audioBuffer?: AudioBuffer;
}

export interface HistoryItem {
  id: string;
  timestamp: number;
  name: string;
  description: string;
  imageSrc: string;
  sources: GroundingChunk[];
  mapInfo?: {
    rating?: string;
    address?: string;
    uri?: string;
  };
  nearbyPlaces?: GroundingChunk[];
}

export interface SuggestionItem {
  name: string;
  description: string;
  type: string;
}

export interface SuggestionResult {
  title: string;
  introduction: string;
  recommendations: SuggestionItem[];
  places: GroundingChunk[];
}

export interface PlaybackState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
}
