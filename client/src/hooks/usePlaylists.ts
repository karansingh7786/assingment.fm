import { useState, useEffect } from 'react';
import type { Playlist } from '@assignment-fm/shared';
import { playlistService } from '../services/playlistService';

export function usePlaylists() {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    playlistService
      .getAll()
      .then((data) => {
        if (isMounted) {
          setPlaylists(data);
          setError(null);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.message);
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return { playlists, loading, error };
}
