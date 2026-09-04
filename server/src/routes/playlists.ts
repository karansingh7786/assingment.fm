import { Router, type Request, type Response } from 'express';
import { playlistService } from '../services/playlistService.js';

export const playlistRouter = Router();

// GET /api/playlists
playlistRouter.get('/', (_req: Request, res: Response) => {
  try {
    const playlists = playlistService.getAllPlaylists();
    res.json(playlists);
  } catch (error) {
    console.error('Error fetching playlists:', error);
    res.status(500).json({ error: 'Failed to fetch playlists' });
  }
});

// GET /api/playlists/:id
playlistRouter.get('/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const playlist = playlistService.getPlaylistById(id);
    if (!playlist) {
      res.status(404).json({ error: `Playlist with id '${id}' not found` });
      return;
    }
    res.json(playlist);
  } catch (error) {
    console.error(`Error fetching playlist ${req.params.id}:`, error);
    res.status(500).json({ error: 'Failed to fetch playlist' });
  }
});
