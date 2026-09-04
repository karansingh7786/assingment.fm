import type { Playlist } from '@assignment-fm/shared';
import { playlists } from '../data/playlists.js';
import { songRepository } from './songRepository.js';

export class PlaylistRepository {
  getAll(): Playlist[] {
    return playlists.map((p) => ({
      ...p,
      songs: p.songIds
        .map((id) => songRepository.getById(id))
        .filter((s): s is NonNullable<typeof s> => Boolean(s)),
    }));
  }

  getById(id: string): Playlist | undefined {
    const playlist = playlists.find((p) => p.id.toLowerCase() === id.toLowerCase());
    if (!playlist) return undefined;
    return {
      ...playlist,
      songs: playlist.songIds
        .map((songId) => songRepository.getById(songId))
        .filter((s): s is NonNullable<typeof s> => Boolean(s)),
    };
  }
}

export const playlistRepository = new PlaylistRepository();
