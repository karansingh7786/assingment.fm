import { fetchApi } from './api.js';

export const categoryService = {
  getAll: () => fetchApi('/api/categories'),
  getById: (id) => fetchApi(`/api/categories/${encodeURIComponent(id)}`),
};
