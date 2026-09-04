import { useState, useEffect } from 'react';
import type { Mood } from '@assignment-fm/shared';
import { moodService } from '../services/moodService';

export function useMoods() {
  const [moods, setMoods] = useState<Mood[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    moodService
      .getAll()
      .then((data) => {
        if (isMounted) {
          setMoods(data);
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

  return { moods, loading, error };
}
