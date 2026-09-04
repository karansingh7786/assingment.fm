import type { Mood } from '@assignment-fm/shared';
import { moods } from '../data/moods.js';

export class MoodRepository {
  getAll(): Mood[] {
    return moods;
  }

  getById(id: string): Mood | undefined {
    return moods.find(
      (m) =>
        m.id.toLowerCase() === id.toLowerCase() ||
        m.name.toLowerCase() === id.toLowerCase()
    );
  }
}

export const moodRepository = new MoodRepository();
