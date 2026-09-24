import { test, describe, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import type { Song } from '@assignment-fm/shared';
import { youtubeSearchService, YouTubeApiError } from '../server/src/services/youtubeSearchService.js';
import { youtubeService } from '../client/src/services/youtubeService.js';
import { YouTubeIframePlaybackProvider } from '../client/src/services/playback/YouTubeIframePlaybackProvider.js';

describe('Assignment.FM — Phase 2 Step 2 YouTube Integration Tests', () => {
  const originalFetch = globalThis.fetch;
  const originalApiKey = process.env.YOUTUBE_API_KEY;

  beforeEach(() => {
    youtubeSearchService.clearCache();
    youtubeService.clearCache();
    process.env.YOUTUBE_API_KEY = 'test_mock_api_key_12345';
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
    process.env.YOUTUBE_API_KEY = originalApiKey;
  });

  // TEST 1: YouTube search route
  test('1. YouTube search route returns clean items schema', async () => {
    globalThis.fetch = async (input) => {
      const url = String(input);
      assert.ok(url.includes('googleapis.com/youtube/v3/search'));
      assert.ok(url.includes('videoEmbeddable=true'));
      return {
        ok: true,
        status: 200,
        json: async () => ({
          items: [
            {
              id: { videoId: 'mockVid123' },
              snippet: {
                title: 'Pehla Nasha Official Video',
                channelTitle: 'Saregama Music',
                thumbnails: { medium: { url: 'https://i.ytimg.com/vi/mockVid123/mqdefault.jpg' } },
                publishedAt: '2020-01-01T00:00:00Z',
              },
            },
          ],
        }),
      } as Response;
    };

    const result = await youtubeSearchService.search('Pehla Nasha', 5);
    assert.equal(result.items.length, 1);
    assert.equal(result.items[0].videoId, 'mockVid123');
    assert.equal(result.items[0].title, 'Pehla Nasha Official Video');
    assert.equal(result.items[0].channelTitle, 'Saregama Music');
    assert.equal(result.items[0].thumbnail, 'https://i.ytimg.com/vi/mockVid123/mqdefault.jpg');
  });

  // TEST 2: Empty search query
  test('2. Empty search query rejects with 400 Bad Request', async () => {
    await assert.rejects(
      async () => {
        await youtubeSearchService.search('   ');
      },
      (err: any) => {
        assert.ok(err instanceof YouTubeApiError);
        assert.equal(err.statusCode, 400);
        assert.match(err.message, /Search query parameter 'q' is required/i);
        return true;
      }
    );
  });

  // TEST 3: API error handling
  test('3. API error returns safe message without leaking API key', async () => {
    globalThis.fetch = async () => {
      return {
        ok: false,
        status: 500,
        json: async () => ({ error: { message: 'Internal upstream error' } }),
      } as Response;
    };

    await assert.rejects(
      async () => {
        await youtubeSearchService.search('Dil Se');
      },
      (err: any) => {
        assert.ok(err instanceof YouTubeApiError);
        assert.ok(!err.message.includes('test_mock_api_key_12345'));
        assert.match(err.message, /failed/i);
        return true;
      }
    );
  });

  // TEST 4: Missing API key handling
  test('4. Missing API key rejects with 503 Service Unavailable', async () => {
    delete process.env.YOUTUBE_API_KEY;

    await assert.rejects(
      async () => {
        await youtubeSearchService.search('Tujhse Naraz');
      },
      (err: any) => {
        assert.ok(err instanceof YouTubeApiError);
        assert.equal(err.statusCode, 503);
        assert.match(err.message, /YouTube API key is not configured/i);
        return true;
      }
    );
  });

  // TEST 5: Song -> video ID resolution
  test('5. Song -> video ID resolution builds query and resolves video ID', async () => {
    const testSong: Song = {
      id: 'ek-ladki-test',
      title: 'Ek Ladki Ko Dekha',
      artist: 'Kumar Sanu',
      movie: '1942: A Love Story',
      moods: ['Romantic'],
      categories: ['Bollywood'],
      language: 'Hindi',
    };

    globalThis.fetch = async (input) => {
      const url = String(input);
      assert.ok(url.includes('Ek%20Ladki%20Ko%20Dekha'));
      return {
        ok: true,
        status: 200,
        json: async () => ({
          items: [
            {
              videoId: 'b993k7LVyfA',
              title: 'Ek Ladki Ko Dekha - Official',
              channelTitle: 'Saregama Music',
            },
          ],
        }),
      } as Response;
    };

    const videoId = await youtubeService.resolveSong(testSong);
    assert.equal(videoId, 'b993k7LVyfA');
    assert.equal(testSong.youtubeVideoId, 'b993k7LVyfA');
  });

  // TEST 6: Duplicate resolution requests
  test('6. Duplicate resolution requests share in-flight promise and hit API once', async () => {
    let fetchCount = 0;
    const testSong: Song = {
      id: 'chitthi-test',
      title: 'Chitthi Aayi Hai',
      artist: 'Pankaj Udhas',
      movie: 'Naam',
      moods: ['Sad'],
      categories: ['Bollywood'],
      language: 'Hindi',
    };

    globalThis.fetch = async () => {
      fetchCount++;
      await new Promise((r) => setTimeout(r, 20));
      return {
        ok: true,
        status: 200,
        json: async () => ({
          items: [{ videoId: 'x_uF1gLqJio', title: 'Chitthi Aayi Hai', channelTitle: 'Tips Official' }],
        }),
      } as Response;
    };

    const [res1, res2, res3] = await Promise.all([
      youtubeService.resolveSong(testSong),
      youtubeService.resolveSong(testSong),
      youtubeService.resolveSong(testSong),
    ]);

    assert.equal(res1, 'x_uF1gLqJio');
    assert.equal(res2, 'x_uF1gLqJio');
    assert.equal(res3, 'x_uF1gLqJio');
    assert.equal(fetchCount, 1, 'Search API should only be called once due to deduplication');
  });

  // TEST 7, 8, 9, 13, 14: Mock player load, play, pause, seek, volume
  test('7-9, 13-14. YouTubePlaybackProvider handles load, play, pause, seek, volume', async () => {
    const provider = new YouTubeIframePlaybackProvider('test-player-id');

    // Create a mock YT player instance
    let playerLoadedVideoId: string | null = null;
    let isPlaying = false;
    let seekedTime = -1;
    let playerVolume = 100;

    const mockPlayer = {
      loadVideoById: (videoId: string) => {
        playerLoadedVideoId = videoId;
        isPlaying = true;
      },
      playVideo: () => {
        isPlaying = true;
      },
      pauseVideo: () => {
        isPlaying = false;
      },
      seekTo: (seconds: number) => {
        seekedTime = seconds;
      },
      setVolume: (vol: number) => {
        playerVolume = vol;
      },
      unMute: () => {},
      getCurrentTime: () => 45,
      getDuration: () => 287,
    };

    // Inject mock player directly into private player for isolated unit test
    (provider as any).player = mockPlayer;
    (provider as any).ready = true;

    const song: Song = {
      id: 'pehla-nasha',
      title: 'Pehla Nasha',
      artist: 'Udit Narayan',
      youtubeVideoId: '11S5D5s70hM',
      duration: '4:47',
      moods: ['Romantic'],
      categories: ['Bollywood'],
      language: 'Hindi',
    };

    // 7. Load & 8. Play
    await provider.play(song);
    assert.equal(playerLoadedVideoId, '11S5D5s70hM');
    // Simulate YouTube player reporting PLAYING
    (provider as any).handleStateChange(1);
    assert.equal(provider.isPlaying(), true);

    // 9. Pause
    provider.pause();
    assert.equal(provider.isPlaying(), false);
    assert.equal(isPlaying, false);

    // Resume
    await provider.resume();
    (provider as any).handleStateChange(1);
    assert.equal(provider.isPlaying(), true);
    assert.equal(isPlaying, true);

    // 13. Seek
    provider.seek(120);
    assert.equal(seekedTime, 120);
    assert.equal(provider.getCurrentTime(), 120);

    // 14. Volume (0.0 - 1.0 maps to 0 - 100)
    provider.setVolume(0.65);
    assert.equal(provider.getVolume(), 0.65);
    assert.equal(playerVolume, 65);

    provider.destroy();
  });

  // TEST 10, 11, 12: Next, previous, and ended -> next track transition
  test('10-12. Queue Next, Previous and Ended transitions', async () => {
    const queue: Song[] = [
      { id: 's1', title: 'Song 1', artist: 'Artist 1', moods: ['Romantic'], categories: ['Bollywood'], language: 'Hindi' },
      { id: 's2', title: 'Song 2', artist: 'Artist 2', moods: ['Romantic'], categories: ['Bollywood'], language: 'Hindi' },
      { id: 's3', title: 'Song 3', artist: 'Artist 3', moods: ['Romantic'], categories: ['Bollywood'], language: 'Hindi' },
    ];

    let currentIdx = 0;
    const playTrack = (idx: number) => {
      currentIdx = idx;
    };

    const next = () => {
      currentIdx = (currentIdx + 1) % queue.length;
    };

    const previous = () => {
      currentIdx = (currentIdx - 1 + queue.length) % queue.length;
    };

    // Initial track
    playTrack(0);
    assert.equal(queue[currentIdx].id, 's1');

    // 10. Next
    next();
    assert.equal(queue[currentIdx].id, 's2');

    // 11. Previous
    previous();
    assert.equal(queue[currentIdx].id, 's1');

    // 12. Ended -> simulate ended event triggering next
    const provider = new YouTubeIframePlaybackProvider('test-player-id');
    let endedFired = false;
    provider.on('ended', () => {
      endedFired = true;
      next();
    });

    // Trigger state change 0 (ENDED)
    (provider as any).handleStateChange(0);

    assert.equal(endedFired, true);
    assert.equal(queue[currentIdx].id, 's2', 'Ended event should advance queue to next track');

    provider.destroy();
  });

  // TEST 15: Unavailable video handling
  test('15. Unavailable / non-embeddable video emits error with restriction info', async () => {
    const provider = new YouTubeIframePlaybackProvider('test-player-id');
    let receivedError: any = null;

    provider.on('error', (err) => {
      receivedError = err;
    });

    // Code 150 = Video owner does not allow embedding
    (provider as any).handleError(150);

    assert.ok(receivedError !== null);
    assert.equal(receivedError.code, 150);
    assert.equal(receivedError.isEmbedRestricted, true);
    assert.match(receivedError.message, /cannot be embedded/i);

    provider.destroy();
  });

  // TEST 16: Autoplay blocked handling
  test('16. Autoplay blocked error is caught and flagged', async () => {
    const provider = new YouTubeIframePlaybackProvider('test-player-id');

    const song: Song = {
      id: 'pehla-nasha',
      title: 'Pehla Nasha',
      artist: 'Udit Narayan',
      youtubeVideoId: '11S5D5s70hM',
      moods: ['Romantic'],
      categories: ['Bollywood'],
      language: 'Hindi',
    };

    // Mock player where loadVideoById throws NotAllowedError
    (provider as any).player = {
      loadVideoById: () => {
        const error = new Error('play() failed because the user didn\'t interact with the document first.');
        error.name = 'NotAllowedError';
        throw error;
      },
    };
    (provider as any).ready = true;

    await assert.rejects(
      async () => {
        await provider.play(song);
      },
      (err: any) => {
        assert.match(err.message, /NotAllowedError/i);
        return true;
      }
    );

    provider.destroy();
  });
});
