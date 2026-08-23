# Assignment FM

Assignment FM is a playful music discovery site for engineering students surviving assignments, coding sessions, and late-night deadlines.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/assignment-fm/src/App.tsx` — single-page product surface, centralized track/mood/playlist data, and player interactions
- `artifacts/assignment-fm/src/index.css` — Assignment FM theme, typography, textures, and motion
- `artifacts/assignment-fm/.replit-artifact/artifact.toml` — root-routed web artifact configuration

## Architecture decisions

- The first release is frontend-only; music is represented with official YouTube links rather than hosted audio files.
- Track, mood, and playlist content lives in centralized arrays so the library can grow without changing component structure.
- The visual language intentionally uses editorial campus-radio energy instead of copying a mainstream streaming service.

## Product

Users can discover playlists and moods, search and filter a song library, select tracks, manage a queue, favorite the current track, open official YouTube sources, and share the experience.

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

_Populate as you build — sharp edges, "always run X before Y" rules._

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
