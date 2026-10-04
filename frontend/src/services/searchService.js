import { fetchApi } from './api.js';

export const searchService = {
  search: (query) => {
    if (!query || !query.trim()) {
      return Promise.resolve([]);
    }
    return fetchApi(`/api/search?q=${encodeURIComponent(query.trim())}`);
  },
};
