import type { Song } from '@assignment-fm/shared';
import type { PlaybackEventListener, PlaybackEventType, PlaybackProvider } from './PlaybackProvider';

/**
 * YouTubeIframePlaybackProvider — Planned for Phase 2
 *
 * This stub documents the extension point for mounting the official
 * YouTube IFrame Player API to stream full audio tracks without
 * re-architecting any player components or state management.
 */
export class YouTubeIframePlaybackProvider implements PlaybackProvider {
  play(_song: Song): Promise<void> {
    throw new Error('YouTube IFrame playback is scheduled for Phase 2. Using MockPlaybackProvider.');
  }

  pause(): void {
    // Phase 2 implementation
  }

  resume(): Promise<void> {
    return Promise.resolve();
  }

  seek(_timeInSeconds: number): void {
    // Phase 2 implementation
  }

  setVolume(_volume: number): void {
    // Phase 2 implementation
  }

  getVolume(): number {
    return 1.0;
  }

  getCurrentTime(): number {
    return 0;
  }

  getDuration(): number {
    return 0;
  }

  isPlaying(): boolean {
    return false;
  }

  on(_event: PlaybackEventType, _listener: PlaybackEventListener): void {
    // Phase 2 implementation
  }

  off(_event: PlaybackEventType, _listener: PlaybackEventListener): void {
    // Phase 2 implementation
  }

  destroy(): void {
    // Phase 2 implementation
  }
}
