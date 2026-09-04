import type { Song } from '@assignment-fm/shared';

export type PlaybackEventType =
  | 'play'
  | 'pause'
  | 'ended'
  | 'timeupdate'
  | 'volumechange'
  | 'error'
  | 'loadstart';

export type PlaybackEventListener = (data?: unknown) => void;

export interface PlaybackProvider {
  play(song: Song): Promise<void>;
  pause(): void;
  resume(): Promise<void>;
  seek(timeInSeconds: number): void;
  setVolume(volume: number): void; // 0.0 to 1.0
  getVolume(): number;
  getCurrentTime(): number;
  getDuration(): number;
  isPlaying(): boolean;
  on(event: PlaybackEventType, listener: PlaybackEventListener): void;
  off(event: PlaybackEventType, listener: PlaybackEventListener): void;
  destroy(): void;
}
