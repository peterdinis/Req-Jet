import { useState, useEffect } from "react";

/**
 * Custom React hook for tracking a CSS media query.
 *
 * Returns a boolean indicating whether the given media query currently matches.
 *
 * @param {string} query - The CSS media query string, e.g. "(max-width: 768px)".
 * @returns {boolean} `true` if the media query matches, otherwise `false`.
 *
 * @example
 * ```ts
 * const isMobile = useMediaQuery("(max-width: 768px)");
 *
 * return (
 *   <div>
 *     {isMobile ? "Mobile layout" : "Desktop layout"}
 *   </div>
 * );
 * ```
 */
export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) setMatches(media.matches);
    const listener = () => setMatches(media.matches);
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, [matches, query]);

  return matches;
}
