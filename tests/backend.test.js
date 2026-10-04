import { test, describe, before, after } from 'node:test';
import assert from 'node:assert/strict';
import app from '../backend/src/app.js';

describe('Assignment.FM — Backend API Endpoints Test', () => {
  let server;
  let baseUrl;

  before(async () => {
    await new Promise((resolve) => {
      server = app.listen(0, '127.0.0.1', () => {
        const address = server.address();
        baseUrl = `http://127.0.0.1:${address.port}`;
        resolve();
      });
    });
  });

  after(async () => {
    await new Promise((resolve) => {
      server.close(resolve);
    });
  });

  test('GET /api/healthz returns status ok', async () => {
    const res = await fetch(`${baseUrl}/api/healthz`);
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.deepEqual(data, { status: 'ok' });
  });

  test('GET /api/songs returns array of songs with proper fields', async () => {
    const res = await fetch(`${baseUrl}/api/songs`);
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.ok(Array.isArray(data));
    assert.ok(data.length > 0);
    const pehlaNasha = data.find((s) => s.id === 'pehla-nasha');
    assert.ok(pehlaNasha);
    assert.equal(pehlaNasha.title, 'Pehla Nasha');
    assert.equal(pehlaNasha.artist, 'Udit Narayan, Sadhana Sargam');
    assert.equal(pehlaNasha.youtubeVideoId, 'iSUK1QoK9-E');
  });

  test('GET /api/songs/:id returns specific song', async () => {
    const res = await fetch(`${baseUrl}/api/songs/pehla-nasha`);
    assert.equal(res.status, 200);
    const song = await res.json();
    assert.equal(song.id, 'pehla-nasha');
    assert.equal(song.title, 'Pehla Nasha');
  });

  test('GET /api/songs/:id returns 404 for non-existent song', async () => {
    const res = await fetch(`${baseUrl}/api/songs/non-existent-song-xyz`);
    assert.equal(res.status, 404);
    const err = await res.json();
    assert.ok(err.error);
  });

  test('GET /api/moods returns available moods', async () => {
    const res = await fetch(`${baseUrl}/api/moods`);
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.ok(Array.isArray(data));
    assert.ok(data.some((m) => m.id === 'romantic'));
    assert.ok(data.some((m) => m.id === 'late-night'));
  });

  test('GET /api/categories returns available categories', async () => {
    const res = await fetch(`${baseUrl}/api/categories`);
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.ok(Array.isArray(data));
    assert.ok(data.some((c) => c.id === 'romance'));
  });

  test('GET /api/playlists returns available playlists with resolved songs', async () => {
    const res = await fetch(`${baseUrl}/api/playlists`);
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.ok(Array.isArray(data));
    const radio = data.find((p) => p.id === 'radio');
    assert.ok(radio);
    assert.ok(Array.isArray(radio.songs));
    assert.ok(radio.songs.length > 0);
  });

  test('GET /api/search?q=pehla returns matching songs', async () => {
    const res = await fetch(`${baseUrl}/api/search?q=pehla`);
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.ok(Array.isArray(data));
    assert.ok(data.length > 0);
    assert.ok(data.some((s) => s.id === 'pehla-nasha'));
  });

  test('GET /api/youtube/search returns items or catalog fallback without API key', async () => {
    const res = await fetch(`${baseUrl}/api/youtube/search?q=Pehla+Nasha`);
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.ok(data.items);
    assert.ok(Array.isArray(data.items));
    assert.ok(data.items.length > 0);
    assert.equal(data.items[0].videoId, 'iSUK1QoK9-E');
  });
});
