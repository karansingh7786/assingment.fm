import type { Playlist } from '@assignment-fm/shared';
import { fetchApi } from './api';

export const playlistService = {
  getAll: (): Promise<Playlist[]> => fetchApi<Playlist[]>('/api/playlists'),
  getById: (id: string): Promise<Playlist> => fetchApi<Playlist>(`/api/playlists/${encodeURIComponent(id)}`),
};
