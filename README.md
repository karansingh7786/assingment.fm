# Assignment FM 🎧
*“Assignments modern hain. Gaane timeless hain.”*

Assignment FM is a nostalgic, mood-based Indian music discovery and radio web app tailored for engineering students surviving assignments, coding sessions, and late-night deadlines. It combines the warmth of a vintage 80s & 90s Bollywood jukebox with modern web engineering.

---

## 🚀 Quick Start

### Prerequisites
- **Node.js**: LTS version (v20.x or higher recommended)
- **npm**: v10.x or higher

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Servers
Starts both the Express API (`http://localhost:5000`) and the Vite React app (`http://localhost:5173`) concurrently:
```bash
npm run dev
```
Open **`http://localhost:5173`** in your browser.

### 3. Build for Production
Compiles the shared types, Express server, and client bundles:
```bash
npm run build
```

### 4. Run Production Server
Serves the API and static React frontend together from port 5000:
```bash
npm start
```
Open **`http://localhost:5000`** in your browser.

---

## 🎨 Visual Identity & Features

- **Retro Bollywood Jukebox**: Deep wine red (`#6b3942`), warm cream, golden highlights, and subtle film-grain texture.
- **Editorial Typography**: Elegant serif headings (`Fraunces`) paired with clean modern body text (`DM Sans`) and monospace badges (`Space Mono`).
- **Cassette & Reel Animations**: Floating retro audio cassette with Side A / Focus indicator, animated spinning vinyl disc, and equalizer bars during playback.
- **Moods & Categories**: 12 mood spaces (Romantic, Sad, Chill, Focus, Late Night, etc.) and 19 musical genres/eras.
- **Curated Playlists**: Golden Era Radio, 90s Nostalgia, Broken Heart Club, College Canteen, The 11:59 PM Special, Exam Night, Late Night Department, and more.
- **Search & Filter**: Real-time filtering across song titles, artists, films, eras, and categories.
- **Centralized Player**: Sticky bottom bar with playback controls, progress seeking, volume mute toggle, favorite track saving, and an expandable full-screen queue modal.
- **Responsive Layout**: Designed to adapt seamlessly across 320px mobile screens, tablets, and 1440px+ desktop displays.

---

## 🏗️ Architecture & Folder Structure

The project is structured as an npm monorepo with clean separation between UI components, business logic, service layers, and backend repositories:

```
assignment-fm/
├── client/                     # Frontend application (React + Vite)
│   ├── public/                 # Static assets (favicon, robots)
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   │   ├── categories/     # CategoryCard component
│   │   │   ├── layout/         # Header, Footer, SectionKicker
│   │   │   ├── player/         # Cassette, Poster, BottomPlayer, ExpandedPlayer
│   │   │   ├── track/          # TrackRow component
│   │   │   └── ui/             # Radix UI primitives
│   │   ├── context/            # Centralized MusicPlayerContext
│   │   ├── hooks/              # useMusicPlayer, useSongs, useMoods, etc.
│   │   ├── pages/              # Home and NotFound page views
│   │   ├── services/           # API communication & PlaybackProvider layer
│   │   │   └── playback/       # MockPlaybackProvider, YouTubeIframeProvider
│   │   ├── styles/             # index.css (Tailwind v4 tokens & animations)
│   │   ├── types/              # Client type definitions (from @assignment-fm/shared)
│   │   ├── App.tsx             # Root application & provider tree
│   │   └── main.tsx            # React DOM entry point
│   ├── index.html              # HTML shell
│   ├── vite.config.ts          # Vite configuration with /api proxy
│   └── tsconfig.json           # Client TypeScript configuration
├── server/                     # Backend API server (Node.js + Express)
│   ├── src/
│   │   ├── data/               # Demo data sources (songs, moods, categories, playlists)
│   │   ├── repositories/       # Data access repositories (filtering, search)
│   │   ├── routes/             # Express route handlers (/songs, /moods, etc.)
│   │   ├── services/           # Business logic layer
│   │   ├── app.ts              # Express application configuration
│   │   └── index.ts            # Server listener entry point
│   ├── tsconfig.json           # Server TypeScript configuration
│   └── package.json            # Server package manifest
├── shared/                     # Shared TypeScript contracts
│   ├── types/
│   │   └── index.ts            # Core Song, Mood, Category, Playlist interfaces
│   ├── package.json            # Shared package manifest
│   └── tsconfig.json           # Shared TypeScript configuration
├── .env.example                # Environment variable reference
├── AUDIT.md                    # Pre-migration audit report
├── package.json                # Root orchestration scripts
└── README.md
```

---

## 📡 Backend API Contract

The Express backend delivers 9 clean REST API endpoints. All error responses return standard JSON `{ error: string }` bodies without leaking internal stack traces.

| Method | Route | Description | Status Codes |
|---|---|---|---|
| `GET` | `/api/songs` | List all available demo songs | `200`, `500` |
| `GET` | `/api/songs/:id` | Retrieve single song by ID | `200`, `404`, `500` |
| `GET` | `/api/songs/mood/:mood` | List songs filtered by mood | `200`, `400`, `500` |
| `GET` | `/api/songs/category/:category` | List songs filtered by category | `200`, `400`, `500` |
| `GET` | `/api/moods` | List all discovery moods | `200`, `500` |
| `GET` | `/api/categories` | List all genres & eras | `200`, `500` |
| `GET` | `/api/playlists` | List all curated playlists | `200`, `500` |
| `GET` | `/api/playlists/:id` | Playlist detail with resolved songs | `200`, `404`, `500` |
| `GET` | `/api/search?q=` | Search across title/artist/film/mood/category | `200`, `400`, `500` |

---

## 🎵 Player Architecture

The audio player is completely decoupled from UI presentation via two abstractions:

1. **`MusicPlayerContext` (`useMusicPlayer()`)**:
   - Centralizes all player state (`currentSong`, `queue`, `currentIndex`, `isPlaying`, `currentTime`, `duration`, `volume`, `selectedMood`, `favorites`, `isExpanded`).
   - Dispatches uniform actions (`play`, `pause`, `next`, `previous`, `seek`, `setVolume`, `toggleMute`, `toggleFavorite`).
   - Prevents duplicate audio state across multiple UI components.

2. **`PlaybackProvider` Interface**:
   - Defines standard player contracts (`play()`, `pause()`, `seek()`, `setVolume()`, `on()`, `off()`).
   - **Phase 1 Implementation**: `MockPlaybackProvider` simulates realistic audio playback progression with time updates and automatic song advancement.
   - **Phase 2 Extension Point**: `YouTubeIframePlaybackProvider` is ready to be implemented with the official YouTube IFrame API without changing a single line of UI code.

---

## 🧩 How to Add New Content

### 1. Adding a New Song
Add a new object to `server/src/data/songs.ts`:
```ts
{
  id: 'tujhe-dekha-to',
  title: 'Tujhe Dekha To',
  artist: 'Kumar Sanu, Lata Mangeshkar',
  movie: 'Dilwale Dulhania Le Jayenge',
  year: 1995,
  era: '90s',
  moods: ['Romantic', 'Nostalgic'],
  categories: ['Bollywood', '90s', 'Love Songs', 'romance'],
  duration: '5:02',
  label: 'sarson ke khet',
  cover: 'linear-gradient(135deg,#c67d70,#e8c278 50%,#687d7d)',
  youtubeUrl: 'https://www.youtube.com/results?search_query=Tujhe+Dekha+To+official+song',
  language: 'Hindi'
}
```

### 2. Adding a New Mood
Add a new entry to `server/src/data/moods.ts`:
```ts
{
  id: 'canteen-masti',
  name: 'Canteen Masti',
  hindi: 'कैंटीन की मौज',
  description: 'Chai breaks, loud tables, and zero deadlines.'
}
```

### 3. Adding a New Playlist
Add a new entry to `server/src/data/playlists.ts`:
```ts
{
  id: 'viva-survival',
  title: 'Viva Survival Set',
  description: 'For staying calm when the external examiner opens your file.',
  songIds: ['pehla-nasha', 'tujhse-naraz', 'urvashi-urvashi']
}
```

---

## ⚙️ Environment Variables

Copy `.env.example` to `.env` to customize settings:

| Variable | Description | Default |
|---|---|---|
| `PORT` | Node.js Express server port | `5000` |
| `HOST` | Host address binding | `0.0.0.0` |
| `NODE_ENV` | Environment mode (`development` / `production`) | `development` |
| `VITE_PORT` | Vite client dev port | `5173` |

---

## 🔮 Phase 2 Roadmap (Deferred)

The following items are planned for Phase 2:
- **Real Streaming Audio**: Mount the `YouTubeIframePlaybackProvider` to stream directly inside the app.
- **Expanded Catalogue**: Integration with authorized music catalogs across Marathi, Punjabi, Bhojpuri, and Indie.
- **User Accounts & Synced Favorites**: Persistent student profiles, custom playlists, and collaborative listening rooms.
