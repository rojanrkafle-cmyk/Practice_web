import { useEffect, useState } from 'react';

export function useReducedMotion() {
  // Default to not reduced to avoid content jump on hydration
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    function onChange(e: MediaQueryListEvent) {
      setPrefersReducedMotion(e.matches);
    }

    mediaQuery.addEventListener('change', onChange);
    return () => mediaQuery.removeEventListener('change', onChange);
  }, []);

  return prefersReducedMotion;
}

export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    setMatches(mediaQuery.matches);

    function onChange(e: MediaQueryListEvent) {
      setMatches(e.matches);
    }

    mediaQuery.addEventListener('change', onChange);
    return () => mediaQuery.removeEventListener('change', onChange);
  }, [query]);

  return matches;
}

export const motionSafeVariants = (variants: any) => ({
  ...variants,
  initial: (prefersReducedMotion: boolean) =>
    prefersReducedMotion ? {} : variants.initial,
  animate: (prefersReducedMotion: boolean) =>
    prefersReducedMotion ? {} : variants.animate,
  exit: (prefersReducedMotion: boolean) =>
    prefersReducedMotion ? { opacity: 0 } : variants.exit,
});

export const defaultTransition = {
  type: 'spring',
  stiffness: 200,
  damping: 20,
};