import type { Song } from '@assignment-fm/shared';
import { songRepository } from '../repositories/songRepository.js';

export class SongService {
  getAllSongs(): Song[] {
    return songRepository.getAll();
  }

  getSongById(id: string): Song | undefined {
    return songRepository.getById(id);
  }

  getSongsByMood(mood: string): Song[] {
    return songRepository.getByMood(mood);
  }

  getSongsByCategory(category: string): Song[] {
    return songRepository.getByCategory(category);
  }
}

export const songService = new SongService();
