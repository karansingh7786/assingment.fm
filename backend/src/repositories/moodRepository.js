import { moods } from '../data/moods.js';

export class MoodRepository {
  getAll() {
    return moods;
  }

  getById(id) {
    if (!id) return undefined;
    const target = String(id).toLowerCase();
    return moods.find(
      (m) =>
        m.id.toLowerCase() === target ||
        m.name.toLowerCase() === target
    );
  }
}

export const moodRepository = new MoodRepository();
