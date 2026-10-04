import { moodRepository } from '../repositories/moodRepository.js';

export class MoodService {
  getAllMoods() {
    return moodRepository.getAll();
  }

  getMoodById(id) {
    return moodRepository.getById(id);
  }
}

export const moodService = new MoodService();
