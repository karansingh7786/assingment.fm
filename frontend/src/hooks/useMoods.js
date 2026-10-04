import { useState, useEffect } from 'react';
import { moodService } from '../services/moodService';

export function useMoods() {
  const [moods, setMoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
