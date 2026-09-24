export type Era = '80s' | '90s' | '2000s' | '2010s' | '2020s';

export interface Song {
  id: string;
  title: string;
  artist: string;
  album?: string;
  movie?: string; // album / film name (legacy/alias)
  year?: number;
  era?: Era | string;
  moods: string[]; // e.g. ['Romantic', 'Nostalgic', 'Late Night']
  categories: string[]; // e.g. ['Bollywood', '90s', 'Love Songs']
  duration?: string | number; // e.g. '4:47' or 287
  label?: string; // e.g. 'first crush protocol'
  cover?: string; // CSS gradient or image URL
  thumbnail?: string; // image thumbnail
  youtubeUrl?: string; // Official YouTube search or watch link
  youtubeVideoId?: string; // YouTube Video ID for IFrame player
  language: string; // e.g. 'Hindi'
}

export interface Mood {
  id: string; // URL-safe identifier or key
  name: string; // Display name, e.g. 'Romantic'
  hindi?: string; // Hindi script, e.g. 'इश्क़ का मौसम'
  description: string;
  color?: string;
  icon?: string;
}

export interface Category {
  id: string;
  name: string;
  hindi?: string;
  description: string;
  color?: string;
  number?: string;
}

export interface Playlist {
  id: string;
  title: string;
  description: string;
  songIds: string[];
  songs?: Song[];
}

export interface ApiErrorResponse {
  error: string;
}

export interface YouTubeSearchItem {
  videoId: string;
  title: string;
  channelTitle: string;
  thumbnail: string;
  publishedAt: string;
}

export interface YouTubeSearchResponse {
  items: YouTubeSearchItem[];
}
