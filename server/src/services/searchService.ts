import type { Song } from '@assignment-fm/shared';
import { songRepository } from '../repositories/songRepository.js';

export class SearchService {
  search(query: string): Song[] {
    return songRepository.search(query);
  }
}

export const searchService = new SearchService();
