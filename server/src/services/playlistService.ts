import type { Playlist } from '@assignment-fm/shared';
import { playlistRepository } from '../repositories/playlistRepository.js';

export class PlaylistService {
  getAllPlaylists(): Playlist[] {
    return playlistRepository.getAll();
  }

  getPlaylistById(id: string): Playlist | undefined {
    return playlistRepository.getById(id);
  }
}

export const playlistService = new PlaylistService();
