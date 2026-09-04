import { useState, useEffect } from 'react';
import type { Song } from '@assignment-fm/shared';
import { songService } from '../services/songService';

export function useSongs() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    songService
      .getAll()
      .then((data) => {
        if (isMounted) {
          setSongs(data);
          setError(null);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          console.error('Failed to load songs from API:', err);
          setError(err.message);
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return { songs, loading, error };
}
