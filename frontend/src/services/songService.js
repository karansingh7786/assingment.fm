import { fetchApi } from './api.js';

export const songService = {
  getAll: () => fetchApi('/api/songs'),
  getById: (id) => fetchApi(`/api/songs/${encodeURIComponent(id)}`),
  getByMood: (mood) => fetchApi(`/api/songs/mood/${encodeURIComponent(mood)}`),
  getByCategory: (category) => fetchApi(`/api/songs/category/${encodeURIComponent(category)}`),
};
