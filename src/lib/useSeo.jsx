import { useEffect } from 'react';

const DEFAULT_TITLE = 'Reel Chess – Immersive Chess Game with Battle Cutscenes, AI & Tutorials';
const DEFAULT_DESCRIPTION =
  'Play Reel Chess – an immersive chess game with cinematic battle cutscenes, AI opponents (Novice to Grandmaster), local PvP multiplayer, and step-by-step interactive tutorials. Free to play in your browser.';

/**
 * Updates document.title, meta description, and OG/Twitter tags for a page.
 * Restores the homepage defaults on cleanup so SPA navigation doesn't leak stale tags.
 *
 * @param {string} title       - Full <title> text (include "– Reel Chess" suffix or not).
 * @param {string} description - Meta description for this page (150–160 chars ideal).
 */
export function useSeo(title, description) {
  useEffect(() => {
    const fullTitle = title || DEFAULT_TITLE;
    const desc = description || DEFAULT_DESCRIPTION;

    document.title = fullTitle;

    const setMeta = (selector, attr, value) => {
      let el = document.head.querySelector(selector);
      if (!el) {
        el = document.createElement('meta');
        // Extract the attribute name from the selector, e.g. [name="description"]
        const match = selector.match(/\[(\w+)="([^"]+)"\]/);
        if (match) el.setAttribute(match[1], match[2]);
        document.head.appendChild(el);
      }
      el.setAttribute(attr, value);
    };

    setMeta('meta[name="description"]', 'content', desc);
    setMeta('meta[property="og:title"]', 'content', fullTitle);
    setMeta('meta[property="og:description"]', 'content', desc);
    setMeta('meta[name="twitter:title"]', 'content', fullTitle);
    setMeta('meta[name="twitter:description"]', 'content', desc);

    return () => {
      document.title = DEFAULT_TITLE;
      setMeta('meta[name="description"]', 'content', DEFAULT_DESCRIPTION);
      setMeta('meta[property="og:title"]', 'content', 'Reel Chess – Immersive Chess Game with Battle Cutscenes');
      setMeta('meta[property="og:description"]', 'content', DEFAULT_DESCRIPTION);
      setMeta('meta[name="twitter:title"]', 'content', 'Reel Chess – Immersive Chess Game');
      setMeta('meta[name="twitter:description"]', 'content', DEFAULT_DESCRIPTION);
    };
  }, [title, description]);
}