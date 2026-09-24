import React, { createContext, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import type { Song } from '@assignment-fm/shared';
import type { PlaybackProvider } from '../services/playback/PlaybackProvider';
import { defaultPlaybackProvider } from '../services/playback/YouTubeIframePlaybackProvider';
import { youtubeService } from '../services/youtubeService';
import { createRadioFromMood } from '../services/radioEngine';
import { bollywoodTracks } from '../data/bollywood';

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
  isLoading: boolean; // alias
  error: string | null;
  selectedMood: string | null;
  radioName: string;
  favorites: string[];
  isExpanded: boolean;
  notice: string;
  isAutoplayBlocked: boolean;

  // Actions
  play: (song?: Song, newQueue?: Song[]) => void;
  playSong: (song: Song) => void;
  pause: () => void;
  togglePlay: () => void;
  togglePlayPause: () => void;
  next: () => void;
  previous: () => void;
  seek: (percentageOrSeconds: number, isPercentage?: boolean) => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  setQueue: (queue: Song[]) => void;
  clearQueue: () => void;
  selectMood: (mood: string | null, songPool?: Song[]) => void;
  startRadio: (songs: Song[], label?: string) => void;
  toggleFavorite: (songId: string) => void;
  setIsExpanded: (expanded: boolean) => void;
  showNotice: (message: string) => void;
  dismissAutoplayBanner: () => void;
}

const MusicPlayerContext = createContext<MusicPlayerContextType | undefined>(undefined);

export function MusicPlayerProvider({
  children,
  initialSongs,
  provider,
}: {
  children: ReactNode;
  initialSongs?: Song[];
  provider?: PlaybackProvider;
}) {
  const fallbackSongs = (initialSongs && initialSongs.length > 0)
    ? initialSongs
    : (bollywoodTracks as unknown as Song[]);

  const playbackProviderRef = useRef<PlaybackProvider>(provider || defaultPlaybackProvider);
  const [currentSong, setCurrentSong] = useState<Song | null>(fallbackSongs[0] || null);
  const [queue, setQueueState] = useState<Song[]>(fallbackSongs);
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
  const [isAutoplayBlocked, setIsAutoplayBlocked] = useState(false);
  const noticeTimerRef = useRef<number | null>(null);
  const nextRef = useRef<() => void>(() => {});
  const showNoticeRef = useRef<(msg: string) => void>(() => {});

  // Update current song if initialSongs arrives later
  useEffect(() => {
    if (!currentSong && initialSongs && initialSongs.length > 0) {
      setCurrentSong(initialSongs[0]);
      setQueueState(initialSongs);
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
    }, 2800);
  };
  showNoticeRef.current = showNotice;

  // Bind playback provider events once on mount to prevent tearing YT.Player
  useEffect(() => {
    const p = playbackProviderRef.current;

    const onPlay = () => {
      setIsPlaying(true);
      setLoading(false);
      setIsAutoplayBlocked(false);
    };
    const onPause = () => setIsPlaying(false);
    const onLoadStart = () => setLoading(true);
    const onTimeUpdate = (data: unknown) => {
      const { currentTime: ct, duration: d } = data as { currentTime: number; duration: number };
      setCurrentTime(ct);
      if (d && d > 0) setDuration(d);
    };
    const onEnded = () => {
      nextRef.current();
    };
    const onError = (err: unknown) => {
      const errorObj = err as any;
      const errorMsg = errorObj?.message || String(err);
      setError(errorMsg);
      setLoading(false);
      setIsPlaying(false);

      // STEP 1 & 12: DO NOT automatically call next() on YouTube error!
      // Keep the current song selected and show error notice.
      if (errorObj?.isEmbedRestricted) {
        showNoticeRef.current('Track restricted from embedding.');
      } else if (errorObj?.code === 100 || errorObj?.isUnavailable) {
        showNoticeRef.current('Track unavailable on YouTube.');
      } else {
        showNoticeRef.current(`Playback error: ${errorMsg}`);
      }
    };

    p.on('play', onPlay);
    p.on('pause', onPause);
    p.on('loadstart', onLoadStart);
    p.on('timeupdate', onTimeUpdate);
    p.on('ended', onEnded);
    p.on('error', onError);

    return () => {
      p.off('play', onPlay);
      p.off('pause', onPause);
      p.off('loadstart', onLoadStart);
      p.off('timeupdate', onTimeUpdate);
      p.off('ended', onEnded);
      p.off('error', onError);
    };
  }, []);

  const play = (song?: Song, newQueue?: Song[]) => {
    const targetSong = song || currentSong || queue[0];
    if (!targetSong) return;

    const activeQueue = newQueue && newQueue.length > 0 ? newQueue : queue.length === 0 ? [targetSong] : queue;
    if (newQueue && newQueue.length > 0) {
      setQueueState(newQueue);
    } else if (queue.length === 0) {
      setQueueState([targetSong]);
    }

    setCurrentSong(targetSong);
    setLoading(true);
    setError(null);

    // Pre-resolve upcoming 2 songs in background without blocking current playback
    const idx = activeQueue.findIndex((s) => s.id === targetSong.id);
    if (idx !== -1) {
      youtubeService.preResolveUpcoming(activeQueue, idx, 2).catch(() => {});
    }

    playbackProviderRef.current
      .play(targetSong)
      .then(() => {
        // Real playback state is set when YouTube actually fires onPlay
        setLoading(false);
        setIsAutoplayBlocked(false);
        showNotice(`Now playing “${targetSong.title}”`);
      })
      .catch((err) => {
        // Check for browser autoplay policy rejections
        const errorMsg = String(err?.message || err);
        if (
          errorMsg.includes('NotAllowedError') ||
          errorMsg.includes('autoplay') ||
          errorMsg.includes('user gesture')
        ) {
          setIsAutoplayBlocked(true);
          showNotice('Browser paused playback. Tap to play!');
        } else {
          setError(errorMsg);
          showNotice(`“${targetSong.title}” unavailable.`);
          // STEP 1 & 12: DO NOT automatically skip! Keep current track selected.
        }
        setLoading(false);
        setIsPlaying(false);
      });
  };

  const playSong = (song: Song) => {
    play(song);
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
        // STEP 6: Call play() with user gesture, wait for YouTube onPlay event
        play(currentSong);
        setIsAutoplayBlocked(false);
      } else if (queue.length > 0) {
        play(queue[0]);
      }
    }
  };

  const next = () => {
    const activeQueue = queue.length > 0 ? queue : fallbackSongs;
    if (activeQueue.length === 0) return;
    const currentIdx = activeQueue.findIndex((s) => s.id === currentSong?.id);
    const nextIdx = (currentIdx + 1) % activeQueue.length;
    play(activeQueue[nextIdx], activeQueue);
  };
  nextRef.current = next;

  const previous = () => {
    const activeQueue = queue.length > 0 ? queue : fallbackSongs;
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
      showNotice('Playback muted');
    }
  };

  const setQueue = (newQueue: Song[]) => {
    setQueueState(newQueue);
  };

  const clearQueue = () => {
    setQueueState([]);
  };

  const selectMood = (mood: string | null, songPool?: Song[]) => {
    setSelectedMood(mood);
    if (!mood) return;

    const pool = songPool && songPool.length > 0 ? songPool : queue.length > 0 ? queue : fallbackSongs;
    const radioQueue = createRadioFromMood(mood, pool, currentSong?.id);
    const capitalized = mood.charAt(0).toUpperCase() + mood.slice(1);
    setRadioName(`${capitalized} Radio`);

    if (radioQueue.length > 0) {
      setQueueState(radioQueue);
      const firstSong = radioQueue[0];
      setCurrentSong(firstSong);
      setError(null);
      setLoading(false);

      // STEP 7: Cue track instead of calling play() from mood selection effect
      if (typeof (playbackProviderRef.current as any).cue === 'function') {
        (playbackProviderRef.current as any).cue(firstSong).catch(() => {});
      }

      showNotice(`Tuned into ${capitalized} Radio (${radioQueue.length} tracks). Tap Play to listen!`);
    }
  };

  const startRadio = (radioSongs: Song[], label = 'All India Hostel Radio') => {
    if (radioSongs.length === 0) return;
    setRadioName(label);
    setQueueState(radioSongs);
    const firstSong = radioSongs[0];
    setCurrentSong(firstSong);
    setError(null);
    setLoading(false);

    if (typeof (playbackProviderRef.current as any).cue === 'function') {
      (playbackProviderRef.current as any).cue(firstSong).catch(() => {});
    }

    showNotice(`Tuned into ${label}. Tap Play to listen!`);
  };

  const toggleFavorite = (songId: string) => {
    setFavorites((prev) => {
      const isFav = prev.includes(songId);
      const nextFavs = isFav ? prev.filter((id) => id !== songId) : [...prev, songId];
      showNotice(isFav ? 'Removed from your remembered songs' : 'Saved to your remembered songs');
      return nextFavs;
    });
  };

  const dismissAutoplayBanner = () => {
    setIsAutoplayBlocked(false);
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
        isLoading: loading,
        error,
        selectedMood,
        radioName,
        favorites,
        isExpanded,
        notice,
        isAutoplayBlocked,
        play,
        playSong,
        pause,
        togglePlay: togglePlayPause,
        togglePlayPause,
        next,
        previous,
        seek,
        setVolume,
        toggleMute,
        setQueue,
        clearQueue,
        selectMood,
        startRadio,
        toggleFavorite,
        setIsExpanded,
        showNotice,
        dismissAutoplayBanner,
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
