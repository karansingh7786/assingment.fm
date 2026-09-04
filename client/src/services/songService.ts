import type { Song } from '@assignment-fm/shared';
import { fetchApi } from './api';

export const songService = {
  getAll: (): Promise<Song[]> => fetchApi<Song[]>('/api/songs'),
  getById: (id: string): Promise<Song> => fetchApi<Song>(`/api/songs/${encodeURIComponent(id)}`),
  getByMood: (mood: string): Promise<Song[]> => fetchApi<Song[]>(`/api/songs/mood/${encodeURIComponent(mood)}`),
  getByCategory: (category: string): Promise<Song[]> => fetchApi<Song[]>(`/api/songs/category/${encodeURIComponent(category)}`),
};
