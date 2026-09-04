import type { Song } from '@assignment-fm/shared';
import { fetchApi } from './api';

export const searchService = {
  search: (query: string): Promise<Song[]> => {
    if (!query.trim()) {
      return Promise.resolve([]);
    }
    return fetchApi<Song[]>(`/api/search?q=${encodeURIComponent(query.trim())}`);
  },
};
