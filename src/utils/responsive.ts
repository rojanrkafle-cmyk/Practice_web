import { useEffect, useState } from 'react';

export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

type Breakpoint = keyof typeof BREAKPOINTS;

/**
 * Custom hook for media query matching
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    setMatches(mediaQuery.matches);

    const handler = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, [query]);

  return matches;
}

/**
 * Hook to detect current breakpoint
 */
export function useBreakpoint(): Breakpoint {
  const breakpoints = Object.entries(BREAKPOINTS)
    .sort(([, a], [, b]) => b - a); // Sort by size, largest first

  for (const [breakpoint, minWidth] of breakpoints) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const isMatch = useMediaQuery(`(min-width: ${minWidth}px)`);
    if (isMatch) return breakpoint as Breakpoint;
  }

  return 'sm';
}

/**
 * Hook to detect mobile devices
 */
export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      const isMobileViewport = window.innerWidth < BREAKPOINTS.md;
      setIsMobile(isTouchDevice && isMobileViewport);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return isMobile;
}

/**
 * Hook to handle orientation changes
 */
export function useOrientation() {
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>();

  useEffect(() => {
    const updateOrientation = () => {
      const isPortrait = window.matchMedia('(orientation: portrait)').matches;
      setOrientation(isPortrait ? 'portrait' : 'landscape');
    };

    updateOrientation();
    window.addEventListener('orientationchange', updateOrientation);
    window.addEventListener('resize', updateOrientation);

    return () => {
      window.removeEventListener('orientationchange', updateOrientation);
      window.removeEventListener('resize', updateOrientation);
    };
  }, []);

  return orientation;
}

/**
 * CSS utility for safe area insets
 */
export const safeArea = {
  top: 'env(safe-area-inset-top)',
  bottom: 'env(safe-area-inset-bottom)',
  left: 'env(safe-area-inset-left)',
  right: 'env(safe-area-inset-right)',
} as const;