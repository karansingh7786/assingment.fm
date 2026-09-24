import React, { useEffect, useRef, useState } from 'react';
import { defaultPlaybackProvider } from '../../services/playback/YouTubeIframePlaybackProvider';

interface YouTubePlayerHostProps {
  containerId?: string;
  className?: string;
}

/**
 * YouTubePlayerHost
 *
 * Dedicated host component providing the DOM mount point for the official
 * YouTube IFrame Player API. Rendered visibly inside the viewport with standard
 * dimensions (240x135) to comply with YouTube embedded player guidelines and
 * prevent modern browser background-tab/off-screen media throttling.
 */
export function YouTubePlayerHost({
  containerId = 'assignment-fm-yt-player',
  className = '',
}: YouTubePlayerHostProps) {
  const initializedRef = useRef(false);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    defaultPlaybackProvider.setContainerId(containerId);
    defaultPlaybackProvider.initPlayer('iSUK1QoK9-E').catch((err) => {
      console.warn('YouTubePlayerHost delayed initialization:', err?.message || err);
    });

    return () => {
      // Keep player intact across route changes
    };
  }, [containerId]);

  return (
    <aside
      id="youtube-player-host"
      aria-label="YouTube Audio Engine"
      className={`fixed bottom-[90px] right-4 z-30 overflow-hidden rounded-xl border-2 border-[hsl(var(--foreground))] bg-[hsl(var(--card))] shadow-ink transition-all duration-300 ${className} ${
        collapsed ? 'h-7 w-48' : 'w-[240px] h-[165px]'
      }`}
    >
      <div className="flex items-center justify-between bg-[hsl(var(--muted))] px-2.5 py-1 border-b border-[hsl(var(--foreground))]/15 text-[10px] font-mono-custom font-bold">
        <span className="flex items-center gap-1.5 truncate text-[hsl(var(--foreground))]">
          <span className="h-2 w-2 rounded-full bg-red-600 animate-pulse" />
          Master Audio Stream
        </span>
        <button
          type="button"
          onClick={() => setCollapsed(!collapsed)}
          className="rounded px-1 text-[11px] font-bold text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] cursor-pointer"
          title={collapsed ? 'Expand monitor' : 'Collapse monitor'}
        >
          {collapsed ? '▲' : '▼'}
        </button>
      </div>
      <div className="h-[135px] w-[240px] bg-black">
        <div id={containerId} className="h-full w-full" />
      </div>
    </aside>
  );
}
