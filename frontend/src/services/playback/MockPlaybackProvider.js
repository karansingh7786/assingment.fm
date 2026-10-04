/**
 * Converts a duration string like "4:47" or seconds number into total seconds (287)
 */
function parseDuration(duration) {
  if (typeof duration === 'number') return duration;
  if (typeof duration === 'string') {
    const parts = duration.split(':').map((p) => parseInt(p, 10));
    if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
      return parts[0] * 60 + parts[1];
    }
    const parsed = parseInt(duration, 10);
    if (!isNaN(parsed)) return parsed;
  }
  return 180; // default 3 minutes fallback
}

export class MockPlaybackProvider {
  currentSong = null;
  playing = false;
  currentTime = 0;
  duration = 180;
  volume = 1.0;
  timer = null;
  listeners = new Map();

  async play(song) {
    this.currentSong = song;
    this.duration = parseDuration(song.duration);
    this.currentTime = 0;
    this.playing = true;
    this.emit('loadstart', song);
    this.emit('play', song);
    this.startTimer();
  }

  pause() {
    this.playing = false;
    this.stopTimer();
    this.emit('pause');
  }

  async resume() {
    if (!this.currentSong) return;
    this.playing = true;
    this.emit('play', this.currentSong);
    this.startTimer();
  }

  seek(timeInSeconds) {
    this.currentTime = Math.max(0, Math.min(timeInSeconds, this.duration));
    this.emit('timeupdate', { currentTime: this.currentTime, duration: this.duration });
  }

  setVolume(volume) {
    this.volume = Math.max(0, Math.min(volume, 1.0));
    this.emit('volumechange', this.volume);
  }

  getVolume() {
    return this.volume;
  }

  getCurrentTime() {
    return this.currentTime;
  }

  getDuration() {
    return this.duration;
  }

  isPlaying() {
    return this.playing;
  }

  on(event, listener) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event).add(listener);
  }

  off(event, listener) {
    this.listeners.get(event)?.delete(listener);
  }

  destroy() {
    this.stopTimer();
    this.listeners.clear();
  }

  startTimer() {
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

  stopTimer() {
    if (this.timer !== null) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  emit(event, data) {
    this.listeners.get(event)?.forEach((fn) => {
      try {
        fn(data);
      } catch (err) {
        console.error(`Error in playback listener for event '${event}':`, err);
      }
    });
  }
}
