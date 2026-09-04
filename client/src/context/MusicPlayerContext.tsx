import React, { createContext, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import type { Song } from '@assignment-fm/shared';
import type { PlaybackProvider } from '../services/playback/PlaybackProvider';
import { MockPlaybackProvider } from '../services/playback/MockPlaybackProvider';

export interface MusicPlayerContextType {
  currentSong: Song | null;
  queue: Song[];
  currentIndex: number;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  progress: number; // 0 to 100
  volume: number; // 0 to 1
  isMuted: boolean;
  loading: boolean;
  error: string | null;
  selectedMood: string | null;
  radioName: string;
  favorites: string[];
  isExpanded: boolean;
  notice: string;

  // Actions
  play: (song?: Song, newQueue?: Song[]) => void;
  pause: () => void;
  togglePlayPause: () => void;
  next: () => void;
  previous: () => void;
  seek: (percentageOrSeconds: number, isPercentage?: boolean) => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  setQueue: (queue: Song[]) => void;
  selectMood: (mood: string | null) => void;
  startRadio: (songs: Song[], label?: string) => void;
  toggleFavorite: (songId: string) => void;
  setIsExpanded: (expanded: boolean) => void;
  showNotice: (message: string) => void;
}

const MusicPlayerContext = createContext<MusicPlayerContextType | undefined>(undefined);

export function MusicPlayerProvider({
  children,
  initialSongs = [],
  provider,
}: {
  children: ReactNode;
  initialSongs?: Song[];
  provider?: PlaybackProvider;
}) {
  const playbackProviderRef = useRef<PlaybackProvider>(provider || new MockPlaybackProvider());
  const [currentSong, setCurrentSong] = useState<Song | null>(initialSongs[0] || null);
  const [queue, setQueue] = useState<Song[]>(initialSongs);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(180);
  const [volume, setVolumeState] = useState(1.0);
  const [isMuted, setIsMuted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [radioName, setRadioName] = useState('All India Hostel Radio');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [notice, setNotice] = useState('');
  const noticeTimerRef = useRef<number | null>(null);

  // Update current song if initialSongs arrives later
  useEffect(() => {
    if (!currentSong && initialSongs.length > 0) {
      setCurrentSong(initialSongs[0]);
      setQueue(initialSongs);
    }
  }, [initialSongs, currentSong]);

  const currentIndex = useMemo(() => {
    if (!currentSong) return -1;
    return queue.findIndex((s) => s.id === currentSong.id);
  }, [currentSong, queue]);

  const progress = useMemo(() => {
    if (duration <= 0) return 0;
    return Math.min(100, (currentTime / duration) * 100);
  }, [currentTime, duration]);

  const showNotice = (message: string) => {
    setNotice(message);
    if (noticeTimerRef.current) {
      window.clearTimeout(noticeTimerRef.current);
    }
    noticeTimerRef.current = window.setTimeout(() => {
      setNotice('');
      noticeTimerRef.current = null;
    }, 2600);
  };

  // Bind playback provider events
  useEffect(() => {
    const p = playbackProviderRef.current;

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onTimeUpdate = (data: unknown) => {
      const { currentTime: ct, duration: d } = data as { currentTime: number; duration: number };
      setCurrentTime(ct);
      if (d) setDuration(d);
    };
    const onEnded = () => {
      next();
    };
    const onError = (err: unknown) => {
      setError(String(err));
      setIsPlaying(false);
    };

    p.on('play', onPlay);
    p.on('pause', onPause);
    p.on('timeupdate', onTimeUpdate);
    p.on('ended', onEnded);
    p.on('error', onError);

    return () => {
      p.destroy();
    };
  }, [queue, currentSong]);

  const play = (song?: Song, newQueue?: Song[]) => {
    const targetSong = song || currentSong || queue[0];
    if (!targetSong) return;

    if (newQueue && newQueue.length > 0) {
      setQueue(newQueue);
    } else if (queue.length === 0) {
      setQueue([targetSong]);
    }

    setCurrentSong(targetSong);
    setLoading(true);
    setError(null);
    playbackProviderRef.current
      .play(targetSong)
      .then(() => {
        setIsPlaying(true);
        setLoading(false);
        showNotice(`Now playing “${targetSong.title}” — YouTube link ready`);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };

  const pause = () => {
    playbackProviderRef.current.pause();
    setIsPlaying(false);
  };

  const togglePlayPause = () => {
    if (isPlaying) {
      pause();
    } else {
      if (currentSong) {
        playbackProviderRef.current.resume();
        setIsPlaying(true);
      } else if (queue.length > 0) {
        play(queue[0]);
      }
    }
  };

  const next = () => {
    const activeQueue = queue.length > 0 ? queue : initialSongs;
    if (activeQueue.length === 0) return;
    const currentIdx = activeQueue.findIndex((s) => s.id === currentSong?.id);
    const nextIdx = (currentIdx + 1) % activeQueue.length;
    play(activeQueue[nextIdx], activeQueue);
  };

  const previous = () => {
    const activeQueue = queue.length > 0 ? queue : initialSongs;
    if (activeQueue.length === 0) return;
    const currentIdx = activeQueue.findIndex((s) => s.id === currentSong?.id);
    const prevIdx = (currentIdx - 1 + activeQueue.length) % activeQueue.length;
    play(activeQueue[prevIdx], activeQueue);
  };

  const seek = (percentageOrSeconds: number, isPercentage = true) => {
    const targetSeconds = isPercentage
      ? (percentageOrSeconds / 100) * duration
      : percentageOrSeconds;
    playbackProviderRef.current.seek(targetSeconds);
    setCurrentTime(targetSeconds);
  };

  const setVolume = (newVol: number) => {
    const clamped = Math.max(0, Math.min(1, newVol));
    setVolumeState(clamped);
    setIsMuted(clamped === 0);
    playbackProviderRef.current.setVolume(clamped);
  };

  const toggleMute = () => {
    if (isMuted) {
      setIsMuted(false);
      playbackProviderRef.current.setVolume(volume || 1.0);
      showNotice('Volume restored');
    } else {
      setIsMuted(true);
      playbackProviderRef.current.setVolume(0);
      showNotice('Playback muted in this preview');
    }
  };

  const startRadio = (radioSongs: Song[], label = 'All India Hostel Radio') => {
    if (radioSongs.length === 0) return;
    setRadioName(label);
    setQueue(radioSongs);
    play(radioSongs[0], radioSongs);
    document.getElementById('player')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  };

  const toggleFavorite = (songId: string) => {
    setFavorites((prev) => {
      const isFav = prev.includes(songId);
      const nextFavs = isFav ? prev.filter((id) => id !== songId) : [...prev, songId];
      showNotice(isFav ? 'Removed from your remembered songs' : 'Saved to your remembered songs');
      return nextFavs;
    });
  };

  const selectMood = (mood: string | null) => {
    setSelectedMood(mood);
  };

  return (
    <MusicPlayerContext.Provider
      value={{
        currentSong,
        queue,
        currentIndex,
        isPlaying,
        currentTime,
        duration,
        progress,
        volume,
        isMuted,
        loading,
        error,
        selectedMood,
        radioName,
        favorites,
        isExpanded,
        notice,
        play,
        pause,
        togglePlayPause,
        next,
        previous,
        seek,
        setVolume,
        toggleMute,
        setQueue,
        selectMood,
        startRadio,
        toggleFavorite,
        setIsExpanded,
        showNotice,
      }}
    >
      {children}
    </MusicPlayerContext.Provider>
  );
}

export function useMusicPlayer(): MusicPlayerContextType {
  const context = useContext(MusicPlayerContext);
  if (!context) {
    throw new Error('useMusicPlayer must be used within a MusicPlayerProvider');
  }
  return context;
}
