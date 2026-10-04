import { songRepository } from '../repositories/songRepository.js';

export class SongService {
  getAllSongs() {
    return songRepository.getAll();
  }

  getSongById(id) {
    return songRepository.getById(id);
  }

  getSongsByMood(mood) {
    return songRepository.getByMood(mood);
  }

  getSongsByCategory(category) {
    return songRepository.getByCategory(category);
  }
}

export const songService = new SongService();
