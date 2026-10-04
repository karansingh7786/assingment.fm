import { playlistRepository } from '../repositories/playlistRepository.js';

export class PlaylistService {
  getAllPlaylists() {
    return playlistRepository.getAll();
  }

  getPlaylistById(id) {
    return playlistRepository.getById(id);
  }
}

export const playlistService = new PlaylistService();
