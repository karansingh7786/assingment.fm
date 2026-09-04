export type Era = '80s' | '90s' | '2000s' | '2010s' | '2020s';

export interface Song {
  id: string;
  title: string;
  artist: string;
  movie: string; // album / film name
  year: number;
  era: Era;
  moods: string[]; // e.g. ['Romantic', 'Nostalgic', 'Late Night']
  categories: string[]; // e.g. ['Bollywood', '90s', 'Love Songs']
  duration: string; // e.g. '4:47'
  label: string; // e.g. 'first crush protocol'
  cover: string; // CSS gradient or image URL
  youtubeUrl: string; // Official YouTube search or watch link
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
