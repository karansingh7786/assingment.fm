/**
 * PlaybackProvider interface definition (JS equivalent - documented as JSDoc)
 * 
 * @typedef {'play'|'pause'|'ended'|'timeupdate'|'volumechange'|'error'|'loadstart'|'buffering'|'ready'} PlaybackEventType
 * @typedef {(data?: unknown) => void} PlaybackEventListener
 */

// PlaybackProvider interface (for documentation purposes):
// play(song): Promise<void>
// cue?(song): Promise<void>
// pause(): void
// resume(): Promise<void>
// seek(timeInSeconds): void
// setVolume(volume): void
// getVolume(): number
// getCurrentTime(): number
// getDuration(): number
// isPlaying(): boolean
// on(event, listener): void
// off(event, listener): void
// destroy(): void
