import { fetchApi } from './api.js';

export const moodService = {
  getAll: () => fetchApi('/api/moods'),
  getById: (id) => fetchApi(`/api/moods/${encodeURIComponent(id)}`),
};
