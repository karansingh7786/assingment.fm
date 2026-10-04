import { useState, useEffect } from 'react';
import { playlistService } from '../services/playlistService';

export function usePlaylists() {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
