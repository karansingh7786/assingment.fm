import { playlists } from '../data/playlists.js';
import { songRepository } from './songRepository.js';

export class PlaylistRepository {
  getAll() {
    return playlists.map((p) => ({
      ...p,
      songs: (p.songIds || [])
        .map((id) => songRepository.getById(id))
        .filter(Boolean),
    }));
  }

  getById(id) {
    if (!id) return undefined;
    const playlist = playlists.find((p) => p.id.toLowerCase() === String(id).toLowerCase());
    if (!playlist) return undefined;
    return {
      ...playlist,
      songs: (playlist.songIds || [])
        .map((songId) => songRepository.getById(songId))
        .filter(Boolean),
    };
  }
}

export const playlistRepository = new PlaylistRepository();
