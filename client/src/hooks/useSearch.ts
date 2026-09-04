import { useState, useEffect } from 'react';
import type { Song } from '@assignment-fm/shared';
import { searchService } from '../services/searchService';

export function useSearch(query: string) {
  const [results, setResults] = useState<Song[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed) {
      setResults([]);
      setLoading(false);
      return;
    }

    let isMounted = true;
    setLoading(true);

    const debounceTimer = setTimeout(() => {
      searchService
        .search(trimmed)
        .then((data) => {
          if (isMounted) {
            setResults(data);
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
    }, 250);

    return () => {
      isMounted = false;
      clearTimeout(debounceTimer);
    };
  }, [query]);

  return { results, loading, error };
}
