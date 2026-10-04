import { fetchApi } from './api.js';

export const playlistService = {
  getAll: () => fetchApi('/api/playlists'),
  getById: (id) => fetchApi(`/api/playlists/${encodeURIComponent(id)}`),
};
