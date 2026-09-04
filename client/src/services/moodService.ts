import type { Mood } from '@assignment-fm/shared';
import { fetchApi } from './api';

export const moodService = {
  getAll: (): Promise<Mood[]> => fetchApi<Mood[]>('/api/moods'),
  getById: (id: string): Promise<Mood> => fetchApi<Mood>(`/api/moods/${encodeURIComponent(id)}`),
};
