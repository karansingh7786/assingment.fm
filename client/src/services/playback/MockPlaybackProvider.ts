import type { Song } from '@assignment-fm/shared';
import type { PlaybackEventListener, PlaybackEventType, PlaybackProvider } from './PlaybackProvider';

/**
 * Converts a duration string like "4:47" into total seconds (287)
 */
function parseDuration(durationStr: string): number {
  const parts = durationStr.split(':').map((p) => parseInt(p, 10));
  if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
    return parts[0] * 60 + parts[1];
  }
  return 180; // default 3 minutes fallback
}

export class MockPlaybackProvider implements PlaybackProvider {
  private currentSong: Song | null = null;
  private playing = false;
  private currentTime = 0;
  private duration = 180;
  private volume = 1.0;
  private timer: number | null = null;
  private listeners: Map<PlaybackEventType, Set<PlaybackEventListener>> = new Map();

  async play(song: Song): Promise<void> {
    this.currentSong = song;
    this.duration = parseDuration(song.duration);
    this.currentTime = 0;
    this.playing = true;
    this.emit('loadstart', song);
    this.emit('play', song);
    this.startTimer();
  }

  pause(): void {
    this.playing = false;
    this.stopTimer();
    this.emit('pause');
  }

  async resume(): Promise<void> {
    if (!this.currentSong) return;
    this.playing = true;
    this.emit('play', this.currentSong);
    this.startTimer();
  }

  seek(timeInSeconds: number): void {
    this.currentTime = Math.max(0, Math.min(timeInSeconds, this.duration));
    this.emit('timeupdate', { currentTime: this.currentTime, duration: this.duration });
  }

  setVolume(volume: number): void {
    this.volume = Math.max(0, Math.min(volume, 1.0));
    this.emit('volumechange', this.volume);
  }

  getVolume(): number {
    return this.volume;
  }

  getCurrentTime(): number {
    return this.currentTime;
  }

  getDuration(): number {
    return this.duration;
  }

  isPlaying(): boolean {
    return this.playing;
  }

  on(event: PlaybackEventType, listener: PlaybackEventListener): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(listener);
  }

  off(event: PlaybackEventType, listener: PlaybackEventListener): void {
    this.listeners.get(event)?.delete(listener);
  }

  destroy(): void {
    this.stopTimer();
    this.listeners.clear();
  }

  private startTimer(): void {
    this.stopTimer();
    this.timer = window.setInterval(() => {
      if (!this.playing) return;
      this.currentTime += 1;
      this.emit('timeupdate', { currentTime: this.currentTime, duration: this.duration });
      if (this.currentTime >= this.duration) {
        this.stopTimer();
        this.playing = false;
        this.emit('ended', this.currentSong);
      }
    }, 1000);
  }

  private stopTimer(): void {
    if (this.timer !== null) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  private emit(event: PlaybackEventType, data?: unknown): void {
    this.listeners.get(event)?.forEach((fn) => {
      try {
        fn(data);
      } catch (err) {
        console.error(`Error in playback listener for event '${event}':`, err);
      }
    });
  }
}
