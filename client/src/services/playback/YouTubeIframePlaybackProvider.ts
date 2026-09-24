import type { Song } from '@assignment-fm/shared';
import type { PlaybackEventListener, PlaybackEventType, PlaybackProvider } from './PlaybackProvider';
import { loadYouTubeIframeApi } from './youtubeIframeLoader';
import { youtubeService } from '../youtubeService';

function parseDuration(duration?: string | number): number {
  if (typeof duration === 'number') return duration;
  if (typeof duration === 'string') {
    const parts = duration.split(':').map((p) => parseInt(p, 10));
    if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
      return parts[0] * 60 + parts[1];
    }
    const parsed = parseInt(duration, 10);
    if (!isNaN(parsed)) return parsed;
  }
  return 180;
}

export class YouTubeIframePlaybackProvider implements PlaybackProvider {
  private player: any = null;
  private currentSong: Song | null = null;
  private currentVideoId: string | null = null;
  private containerId = 'assignment-fm-yt-player';
  private ready = false;
  private readyPromise: Promise<void> | null = null;
  private playing = false;
  private currentTime = 0;
  private duration = 180;
  private volume = 1.0;
  private progressTimer: number | null = null;
  private listeners: Map<PlaybackEventType, Set<PlaybackEventListener>> = new Map();

  constructor(containerId = 'assignment-fm-yt-player') {
    this.containerId = containerId;
  }

  setContainerId(id: string): void {
    this.containerId = id;
  }

  /**
   * Initializes the YouTube player instance with a valid initial video ID
   */
  async initPlayer(initialVideoId = 'iSUK1QoK9-E'): Promise<void> {
    if (this.ready && this.player) return;
    if (this.readyPromise) return this.readyPromise;

    this.readyPromise = new Promise<void>(async (resolve, reject) => {
      try {
        const YT = await loadYouTubeIframeApi();

        if (typeof document === 'undefined') {
          resolve();
          return;
        }

        const checkContainer = async (retries = 35): Promise<HTMLElement> => {
          const el = document.getElementById(this.containerId);
          if (el) return el;
          if (retries <= 0) {
            throw new Error(`Container #${this.containerId} not found in DOM`);
          }
          await new Promise((r) => setTimeout(r, 100));
          return checkContainer(retries - 1);
        };

        await checkContainer();

        const currentOrigin =
          typeof window !== 'undefined' && window.location.origin
            ? window.location.origin
            : 'http://localhost:5173';

        this.player = new YT.Player(this.containerId, {
          height: '100%',
          width: '100%',
          videoId: initialVideoId,
          host: 'https://www.youtube.com',
          playerVars: {
            autoplay: 0,
            controls: 1, // Keep visible controls available in monitor
            disablekb: 0,
            fs: 0,
            modestbranding: 1,
            rel: 0,
            playsinline: 1,
            enablejsapi: 1,
            origin: currentOrigin,
          },
          events: {
            onReady: () => {
              this.ready = true;
              this.currentVideoId = initialVideoId;
              try {
                if (this.player && typeof this.player.unMute === 'function') {
                  this.player.unMute();
                }
                if (this.player && typeof this.player.setVolume === 'function') {
                  this.player.setVolume(Math.round(this.volume * 100));
                }
              } catch (e) {
                console.warn('Could not configure initial audio on YT.Player:', e);
              }
              // STEP 2: Required logging
              console.log('[AssignmentFM][YouTube]\nPLAYER_READY');
              this.emit('ready');
              resolve();
            },
            onStateChange: (event: { data: number }) => {
              this.handleStateChange(event.data);
            },
            onError: (event: { data: number }) => {
              this.handleError(event.data);
            },
          },
        });
      } catch (err) {
        this.readyPromise = null;
        console.error('Failed to initialize YouTube IFrame Player:', err);
        reject(err);
      }
    });

    return this.readyPromise;
  }

  private handleStateChange(state: number): void {
    // YouTube Player States:
    // -1: UNSTARTED, 0: ENDED, 1: PLAYING, 2: PAUSED, 3: BUFFERING, 5: CUED
    const stateNames: Record<string, string> = {
      '-1': 'UNSTARTED',
      '0': 'ENDED',
      '1': 'PLAYING',
      '2': 'PAUSED',
      '3': 'BUFFERING',
      '5': 'CUED',
    };
    const stateName = stateNames[String(state)] || `UNKNOWN (${state})`;

    // STEP 2: Required logging
    console.log(`[AssignmentFM][YouTube]\nSTATE:\n${stateName}`);

    switch (state) {
      case 1: // PLAYING — ONLY here do we confirm playing state
        this.playing = true;
        this.startProgressTimer();

        // Get actual duration from player instance
        if (this.player && typeof this.player.getDuration === 'function') {
          const d = this.player.getDuration();
          if (typeof d === 'number' && d > 0 && !isNaN(d)) {
            this.duration = Math.round(d);
          }
        }
        if (this.player && typeof this.player.getCurrentTime === 'function') {
          const ct = this.player.getCurrentTime();
          if (typeof ct === 'number' && !isNaN(ct)) {
            this.currentTime = Math.round(ct);
          }
        }

        this.emit('play', this.currentSong);
        this.emit('timeupdate', { currentTime: this.currentTime, duration: this.duration });
        break;

      case 2: // PAUSED
        this.playing = false;
        this.stopProgressTimer();
        this.emit('pause');
        break;

      case 3: // BUFFERING
        this.emit('buffering', this.currentSong);
        break;

      case 0: // ENDED
        this.playing = false;
        this.stopProgressTimer();
        this.currentTime = this.duration;
        this.emit('ended', this.currentSong);
        break;

      default:
        break;
    }
  }

  private handleError(code: number): void {
    let message = `YouTube player error (${code})`;
    let isEmbedRestricted = false;
    let isUnavailable = false;

    if (code === 101 || code === 150) {
      message = 'This song cannot be embedded on third-party sites (Error 101/150).';
      isEmbedRestricted = true;
    } else if (code === 100) {
      message = 'Video not found, removed, or marked private (Error 100).';
      isUnavailable = true;
    } else if (code === 153) {
      message = 'Missing required Referer or origin information (Error 153).';
      isEmbedRestricted = true;
    } else if (code === 2) {
      message = 'Invalid video parameter or malformed video ID (Error 2).';
    } else if (code === 5) {
      message = 'HTML5 player error or content cannot be played (Error 5).';
    }

    const vid = this.currentVideoId || this.currentSong?.youtubeVideoId || 'unknown';

    // STEP 2: Required logging
    console.error(`[AssignmentFM][YouTube]\nERROR CODE:\n${code}\nERROR MESSAGE:\n${message}\nVIDEO ID:\n${vid}`);

    this.playing = false;
    this.stopProgressTimer();
    this.emit('error', { code, message, isEmbedRestricted, isUnavailable, song: this.currentSong });
  }

  async cue(song: Song): Promise<void> {
    this.currentSong = song;
    this.duration = parseDuration(song.duration);
    this.currentTime = 0;
    this.emit('loadstart', song);

    let videoId = song.youtubeVideoId?.trim();
    if (!videoId) {
      const resolved = await youtubeService.resolveSong(song);
      if (resolved) {
        videoId = resolved.trim();
        song.youtubeVideoId = videoId;
      }
    }

    if (!videoId) return;

    await this.initPlayer(videoId);

    if (this.player) {
      try {
        if (typeof this.player.cueVideoById === 'function') {
          this.currentVideoId = videoId;
          this.player.cueVideoById(videoId, 0);
        }
      } catch (err) {
        console.warn('Error cueing video in YouTube player:', err);
      }
    }
  }

  async play(song: Song): Promise<void> {
    this.currentSong = song;
    this.duration = parseDuration(song.duration);
    this.currentTime = 0;
    this.emit('loadstart', song);

    let videoId = song.youtubeVideoId?.trim();
    if (!videoId) {
      const resolved = await youtubeService.resolveSong(song);
      if (!resolved) {
        const error = new Error(`Could not find a playable YouTube video for "${song.title}"`);
        this.emit('error', { code: 100, message: error.message, song });
        throw error;
      }
      videoId = resolved.trim();
      song.youtubeVideoId = videoId;
    }

    // STEP 2: Required logging
    const query = youtubeService.constructSearchQuery(song);
    console.log(`[AssignmentFM][YouTube]\ntitle:\n${song.title}\nvideoId:\n${videoId}\nquery:\n${query}`);

    await this.initPlayer(videoId);

    if (!this.player) {
      throw new Error('YouTube Player instance could not be initialized');
    }

    try {
      // Ensure audio is unmuted and volume is set
      if (typeof this.player.unMute === 'function') {
        this.player.unMute();
      }
      if (typeof this.player.setVolume === 'function') {
        this.player.setVolume(Math.round(this.volume * 100));
      }

      if (this.currentVideoId === videoId) {
        if (typeof this.player.playVideo === 'function') {
          this.player.playVideo();
        }
      } else {
        this.currentVideoId = videoId;
        if (typeof this.player.loadVideoById === 'function') {
          this.player.loadVideoById(videoId, 0);
        }
        if (typeof this.player.playVideo === 'function') {
          this.player.playVideo();
        }
      }
      // NOTE: We DO NOT set this.playing = true here!
      // Real playing state is set ONLY when YouTube fires onStateChange(1) (PLAYING)
    } catch (err: any) {
      console.error('Error in playVideo on YouTube Player:', err);
      if (err?.name === 'NotAllowedError' || String(err).includes('autoplay')) {
        throw new Error('NotAllowedError: Playback blocked by browser autoplay policy');
      }
      throw err;
    }
  }

  pause(): void {
    try {
      if (this.player && typeof this.player.pauseVideo === 'function') {
        this.player.pauseVideo();
      }
    } catch (e) {
      console.warn('Error pausing YouTube player:', e);
    }
    this.playing = false;
    this.stopProgressTimer();
    this.emit('pause');
  }

  async resume(): Promise<void> {
    if (!this.currentSong) return;
    try {
      if (this.player) {
        if (typeof this.player.unMute === 'function') {
          this.player.unMute();
        }
        if (typeof this.player.setVolume === 'function') {
          this.player.setVolume(Math.round(this.volume * 100));
        }
        if (typeof this.player.playVideo === 'function') {
          this.player.playVideo();
        }
      }
    } catch (e) {
      console.warn('Error resuming YouTube player:', e);
    }
  }

  seek(timeInSeconds: number): void {
    this.currentTime = Math.max(0, Math.min(timeInSeconds, this.duration));
    try {
      if (this.player && typeof this.player.seekTo === 'function') {
        this.player.seekTo(this.currentTime, true);
      }
    } catch (e) {
      console.warn('Error seeking in YouTube player:', e);
    }
    this.emit('timeupdate', { currentTime: this.currentTime, duration: this.duration });
  }

  setVolume(volume: number): void {
    this.volume = Math.max(0, Math.min(volume, 1.0));
    try {
      if (this.player) {
        if (this.volume === 0 && typeof this.player.mute === 'function') {
          this.player.mute();
        } else {
          if (typeof this.player.unMute === 'function') {
            this.player.unMute();
          }
          if (typeof this.player.setVolume === 'function') {
            this.player.setVolume(Math.round(this.volume * 100));
          }
        }
      }
    } catch (e) {
      console.warn('Error setting volume in YouTube player:', e);
    }
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
    this.stopProgressTimer();
    this.listeners.clear();
    try {
      if (this.player && typeof this.player.destroy === 'function') {
        this.player.destroy();
      }
    } catch (e) {
      console.warn('Error destroying YouTube player instance:', e);
    }
    this.player = null;
    this.ready = false;
    this.readyPromise = null;
    this.playing = false;
  }

  private startProgressTimer(): void {
    this.stopProgressTimer();
    const intervalFn = typeof window !== 'undefined' ? window.setInterval : setInterval;
    this.progressTimer = intervalFn(() => {
      if (!this.player) return;

      try {
        if (typeof this.player.getCurrentTime === 'function') {
          const ct = this.player.getCurrentTime();
          if (typeof ct === 'number' && !isNaN(ct)) {
            this.currentTime = Math.round(ct);
          }
        }
        if (typeof this.player.getDuration === 'function') {
          const d = this.player.getDuration();
          if (typeof d === 'number' && d > 0 && !isNaN(d)) {
            this.duration = Math.round(d);
          }
        }
        this.emit('timeupdate', { currentTime: this.currentTime, duration: this.duration });
      } catch {
        // ignore cross-context errors while polling
      }
    }, 250) as unknown as number;
  }

  private stopProgressTimer(): void {
    if (this.progressTimer !== null) {
      const clearFn = typeof window !== 'undefined' ? window.clearInterval : clearInterval;
      clearFn(this.progressTimer);
      this.progressTimer = null;
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

export { YouTubeIframePlaybackProvider as YouTubePlaybackProvider };
export const defaultPlaybackProvider = new YouTubeIframePlaybackProvider();
