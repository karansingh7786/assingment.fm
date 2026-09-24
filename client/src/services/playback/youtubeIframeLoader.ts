declare global {
  interface Window {
    YT?: any;
    onYouTubeIframeAPIReady?: () => void;
  }
}

let apiPromise: Promise<any> | null = null;

/**
 * Safely loads the YouTube IFrame Player API script only once
 * Returns a Promise that resolves with window.YT when ready.
 */
export function loadYouTubeIframeApi(): Promise<any> {
  // If YT and YT.Player already available on window, resolve immediately
  if (typeof window !== 'undefined' && window.YT && window.YT.Player) {
    return Promise.resolve(window.YT);
  }

  // If already in-flight, reuse existing promise
  if (apiPromise) {
    return apiPromise;
  }

  apiPromise = new Promise<any>((resolve, reject) => {
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      reject(new Error('Window or Document is not defined'));
      return;
    }

    // Set timeout in case YouTube API fails to load
    const timeout = window.setTimeout(() => {
      apiPromise = null;
      reject(new Error('Timed out waiting for YouTube IFrame API to load'));
    }, 15000);

    const checkReady = () => {
      if (typeof window !== 'undefined' && window.YT && window.YT.Player) {
        window.clearTimeout(timeout);
        window.clearInterval(interval);
        resolve(window.YT);
        return true;
      }
      return false;
    };

    if (checkReady()) return;

    // Polling interval in case onYouTubeIframeAPIReady already fired
    const interval = window.setInterval(checkReady, 50);

    const prevOnReady = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      if (typeof prevOnReady === 'function') {
        try {
          prevOnReady();
        } catch (e) {
          console.error('Error in previous onYouTubeIframeAPIReady handler:', e);
        }
      }
      checkReady();
    };

    // Check if script tag is already in DOM
    const existingScript = document.getElementById('assignment-fm-youtube-iframe-api');
    if (!existingScript) {
      const script = document.createElement('script');
      script.id = 'assignment-fm-youtube-iframe-api';
      script.src = 'https://www.youtube.com/iframe_api';
      script.async = true;
      script.onerror = (err) => {
        window.clearTimeout(timeout);
        window.clearInterval(interval);
        apiPromise = null;
        reject(new Error('Failed to load YouTube IFrame API script: ' + String(err)));
      };
      document.head.appendChild(script);
    }
  });

  return apiPromise;
}
