# Assignment FM — Pre-Migration Audit Report

## 1. Executive Summary

This audit catalogs all Replit-specific plumbing, architecture patterns, and constraints in **Assignment FM** prior to de-platforming to a standalone React (Vite) + Node.js (Express) + TypeScript stack.

The migration objective is to achieve a completely independent, standard npm-runnable codebase (`npm install`, `npm run dev`, `npm run build`, `npm start`) while preserving 100% of the existing visual styling, layout, cassette player animations, and Indian retro jukebox aesthetics.

---

## 2. Replit-Specific Surface Area

### 2.1 Configuration and Deployment Files
- `.replit`: Configures Replit container (`nodejs-24`, `python-base-3.13`), autoscale deployment target, and agent stack declaration `PNPM_WORKSPACE`.
- `.replitignore`: Replit-specific ignore file.
- `replit.md`: Replit internal development guide and pointers.
- `pnpm-workspace.yaml`:
  - Contains `@replit/*` allowlist exemptions for package release age security.
  - Contains pnpm `catalog:` version definitions.
  - Contains hardcoded architecture overrides explicitly stripping non-linux platforms (`"esbuild>@esbuild/win32-x64": "-"`), causing issues outside Replit's Linux container.
- `pnpm-lock.yaml`: Lockfile bound to pnpm workspace catalogs.
- `scripts/post-merge.sh`: Replit post-merge hook.
- `artifacts/**/.replit-artifact/artifact.toml`: Replit web artifact routing configurations.

### 2.2 Packages & Vite Plugins
- `@replit/connectors-sdk`: In root `package.json`.
- `@replit/vite-plugin-cartographer`: In `artifacts/assignment-fm/vite.config.ts` and `artifacts/mockup-sandbox/package.json`.
- `@replit/vite-plugin-dev-banner`: In `artifacts/assignment-fm/vite.config.ts`.
- `@replit/vite-plugin-runtime-error-modal`: In `artifacts/assignment-fm/vite.config.ts` and `artifacts/mockup-sandbox/package.json`.
- `artifacts/mockup-sandbox`: A throwaway sandbox artifact generated inside Replit for design mockups, completely unused by the product.

### 2.3 Environment Assumptions & Hooks
- `artifacts/assignment-fm/vite.config.ts`:
  - Enforces required `PORT` and `BASE_PATH` environment variables, throwing runtime errors if missing:
    ```ts
    const rawPort = process.env.PORT;
    if (!rawPort) throw new Error('PORT environment variable is required but was not provided.');
    const basePath = process.env.BASE_PATH;
    if (!basePath) throw new Error('BASE_PATH environment variable is required but was not provided.');
    ```
  - Checks `process.env.REPL_ID !== undefined` to load cartographer and dev-banner plugins.
- Root `package.json`:
  - Contains a bash `preinstall` hook:
    ```json
    "preinstall": "sh -c 'rm -f package-lock.json yarn.lock; case \"$npm_config_user_agent\" in pnpm/*) ;; *) echo \"Use pnpm instead\" >&2; exit 1 ;; esac'"
    ```
    This actively terminates any standard `npm install` on non-pnpm environments.
- `artifacts/assignment-fm/index.html`:
  - Meta tags explicitly referencing: `"Assignment FM — built on Replit. Update this description to reflect the app."`
- `artifacts/assignment-fm/src/components/ui/button.tsx` & `badge.tsx`:
  - Inline comment annotations referring to `// @replit`.

---

## 3. Current Architecture

### 3.1 Client Architecture
- **Location**: `artifacts/assignment-fm/`
- **Stack**: React 19, Vite 7, Tailwind CSS v4 (`@tailwindcss/vite`), Lucide React, Radix UI primitives, Wouter.
- **Structure**:
  - A monolithic 289-line component in `artifacts/assignment-fm/src/App.tsx` contains all UI sections:
    - Hero with floating cassette animation (`cassette-float`), pulsing equalizer bars, and student count.
    - Category cards grid with active states and quick-radio buttons.
    - Essential Record jukebox horizontal scroll.
    - "Remember these?" section.
    - Searchable and filterable Library table with real-time query matching across title, artist, movie, year, era, and category.
    - Film browser grid.
    - Special programming playlists.
    - Bottom sticky retro player with cassette icon, progress bar, play/pause, prev/next, volume, and YouTube external links.
    - Full-screen expanded player modal with queue management.
  - State (`currentTrack`, `isPlaying`, `activeFilter`, `search`, `queue`, `favorites`, `expanded`, `progress`, `movieFilter`) is managed locally in `Home` using React `useState` hooks. No centralized state management or audio abstraction exists.

### 3.2 Backend & Data Layer
- **Location**: `artifacts/api-server/`
- **Stack**: Express 5, Pino logger, esbuild bundler (`build.mjs`).
- **Endpoints**: Only `GET /api/healthz`. No endpoints exist for songs, moods, categories, or playlists.
- **Database & Schemas**:
  - `lib/db` has empty Drizzle ORM boilerplate (`export {}`). No database models or tables exist.
  - `lib/api-spec` has an OpenAPI spec with only `/healthz`.
  - `lib/api-client-react` has empty client code generated from the spec.
- **Data Source**:
  - The client currently reads entirely from static arrays in `artifacts/assignment-fm/src/data/bollywood.ts`:
    - 26 Bollywood tracks from the 80s and 90s with metadata, custom gradient covers, and official YouTube search links.
    - 6 categories (`romance`, `sad`, `masti`, `late-night`, `study`, `dance`).
    - 8 films.
    - 3 playlists (`radio`, `assignment`, `canteen`).

---

## 4. Visual Baseline & Verification Status

### 4.1 Pre-Migration Baseline Execution Status
The application could **not be run in its pre-migration state on this host machine** because:
1. `node_modules` are not present in the workspace.
2. `pnpm` is not installed on the Windows system.
3. The root `preinstall` hook actively aborts `npm install`.
4. Subpackages declare `catalog:` version dependencies that `npm` cannot resolve.
5. The unmigrated Vite configuration throws immediately when Replit container variables are missing.

### 4.2 Preservation Strategy
All CSS tokens, typography pairings (`Fraunces` editorial serif, `DM Sans` sans-serif, and `Space Mono`), color variables (`hsl(38 46% 91%)`, wine red `hsl(350 41% 17%)`, turmeric yellow `hsl(42 73% 58%)`), keyframes (`reveal`, `drift`, `pulse-dot`), grain textures, and DOM layouts have been carefully audited line-by-line.

During restructuring:
- Component markup and Tailwind classes will be extracted verbatim.
- Data-testid attributes will be preserved for continuous testing.
- The new dev server will be launched and inspected across multiple viewports (desktop 1440px, tablet 768px, mobile 375px/390px/320px) via browser automation to verify 100% visual parity before finalizing.

---

## 5. Risk Assessment & Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Dependency resolution under npm | Build failure due to `catalog:` syntax | Convert all dependencies to standard pinned semver ranges in clean `package.json` files |
| Linux-x64 esbuild overrides on Windows | Native binary failures | Remove Replit's architecture override block from package definitions |
| UI regression during component extraction | Broken layout or styles | Keep exact JSX elements, inline styles, CSS classes, and SVG structure |
| Hardcoded component state | Duplicate player state | Centralize in `MusicPlayerContext` and `useMusicPlayer()` hook with `PlaybackProvider` |
| Monorepo complexity | Complex commands | Use clean npm workspaces with unified root scripts (`npm run dev`, `npm run build`, `npm start`) |
