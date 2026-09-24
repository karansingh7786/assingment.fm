import { Router } from 'express';
import { songRouter } from './songs.js';
import { moodRouter } from './moods.js';
import { categoryRouter } from './categories.js';
import { playlistRouter } from './playlists.js';
import { searchRouter } from './search.js';
import { youtubeRouter } from './youtube.js';

const router = Router();

router.get('/healthz', (_req, res) => {
  res.json({ status: 'ok' });
});

router.use('/songs', songRouter);
router.use('/moods', moodRouter);
router.use('/categories', categoryRouter);
router.use('/playlists', playlistRouter);
router.use('/search', searchRouter);
router.use('/youtube', youtubeRouter);

export default router;
