import { songRepository } from '../repositories/songRepository.js';

export class SearchService {
  search(query) {
    return songRepository.search(query);
  }
}

export const searchService = new SearchService();
