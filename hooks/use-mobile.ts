import * as React from "react";

const MOBILE_BREAKPOINT = 768;

/**
 * Custom hook to determine if the current viewport width corresponds to a mobile device.
 *
 * Uses `window.matchMedia` to track viewport width changes and returns a boolean indicating
 * whether the width is less than the defined mobile breakpoint (768px by default).
 *
 * @returns {boolean} `true` if the viewport width is below the mobile breakpoint, otherwise `false`.
 *
 * @example
 * const isMobile = useIsMobile();
 * if (isMobile) {
 *   // Render mobile-specific UI
 * } else {
 *   // Render desktop UI
 * }
 */
export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(
    undefined,
  );

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    mql.addEventListener("change", onChange);
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return !!isMobile;
}
