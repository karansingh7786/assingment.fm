import type { Mood } from '@assignment-fm/shared';
import { moodRepository } from '../repositories/moodRepository.js';

export class MoodService {
  getAllMoods(): Mood[] {
    return moodRepository.getAll();
  }

  getMoodById(id: string): Mood | undefined {
    return moodRepository.getById(id);
  }
}

export const moodService = new MoodService();
