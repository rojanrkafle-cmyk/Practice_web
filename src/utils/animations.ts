import { MotionValue, Variants, useInView, useTransform, useSpring, useMotionValue, useReducedMotion } from 'framer-motion';
import { useEffect, useRef } from 'react';

// Types
export interface TransitionProps {
  duration?: number;
  delay?: number;
  ease?: number[] | string;
}

export interface AnimationConfig {
  initial?: object;
  animate?: object;
  exit?: object;
  transition?: TransitionProps;
}

// Transition presets
export const transitions = {
  spring: {
    type: 'spring',
    stiffness: 100,
    damping: 15,
  },
  easeOut: {
    duration: 0.3,
    ease: [0, 0, 0.2, 1],
  },
  easeInOut: {
    duration: 0.4,
    ease: [0.4, 0, 0.2, 1],
  },
  smooth: {
    duration: 0.6,
    ease: [0.6, 0.01, 0.05, 0.95],
  },
} as const;

// Base variants
export const fadeIn: Variants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: transitions.smooth,
  },
  exit: { opacity: 0 },
};

export const fadeInUp: Variants = {
  initial: { opacity: 0, y: 60 },
  animate: {
    opacity: 1,
    y: 0,
    transition: transitions.smooth,
  },
  exit: { opacity: 0, y: 60 },
};

export const fadeInDown: Variants = {
  initial: { opacity: 0, y: -60 },
  animate: {
    opacity: 1,
    y: 0,
    transition: transitions.smooth,
  },
  exit: { opacity: 0, y: -60 },
};

export const fadeInLeft: Variants = {
  initial: { opacity: 0, x: -60 },
  animate: {
    opacity: 1,
    x: 0,
    transition: transitions.smooth,
  },
  exit: { opacity: 0, x: -60 },
};

export const fadeInRight: Variants = {
  initial: { opacity: 0, x: 60 },
  animate: {
    opacity: 1,
    x: 0,
    transition: transitions.smooth,
  },
  exit: { opacity: 0, x: 60 },
};

export const scaleIn: Variants = {
  initial: { opacity: 0, scale: 0.8 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: transitions.smooth,
  },
  exit: { opacity: 0, scale: 0.8 },
};

export const staggerContainer: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
};

export const slideUp: Variants = {
  initial: { y: 100, opacity: 0 },
  animate: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.8,
      ease: [0.6, 0.01, 0.05, 0.95],
    },
  },
};

// Page transition variants
export const pageTransition: Variants = {
  initial: { opacity: 0, x: -20 },
  animate: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      ease: [0.6, 0.01, 0.05, 0.95],
    },
  },
  exit: {
    opacity: 0,
    x: 20,
    transition: {
      duration: 0.4,
      ease: [0.6, 0.01, 0.05, 0.95],
    },
  },
};

// Gold glow keyframes
export const goldGlow: Variants = {
  initial: { 
    boxShadow: '0 0 0 rgba(255, 215, 0, 0)',
    transition: { duration: 0 }
  },
  animate: {
    boxShadow: '0 0 20px rgba(255, 215, 0, 0.5)',
    transition: {
      duration: 2,
      repeat: Infinity,
      repeatType: 'reverse',
      ease: [0.4, 0, 0.2, 1],
    },
  },
};

/**
 * Creates stagger variants with custom delays
 * @param staggerDelay Delay between each item
 * @param itemDelay Initial delay before stagger begins
 */
export const createStaggerVariants = (staggerDelay = 0.1, itemDelay = 0.3): Variants => ({
  initial: {},
  animate: {
    transition: {
      staggerChildren: staggerDelay,
      delayChildren: itemDelay,
    },
  },
});

/**
 * Hook for scroll-triggered animations
 * @param threshold Visibility threshold to trigger animation
 * @param once Whether to trigger animation only once
 */
export const useScrollAnimation = (threshold = 0.2, once = true) => {
  const ref = useRef(null);
  const inView = useInView(ref, { amount: threshold, once });
  
  return { ref, inView, animate: inView ? 'animate' : 'initial' };
};

/**
 * Hook for parallax scrolling effects
 * @param scrollY Current scroll position
 * @param distance Distance to parallax
 */
export const useParallax = (scrollY: MotionValue<number>, distance: number) => {
  const transform = useTransform(
    scrollY,
    [0, 1],
    [0, distance],
    { clamp: false }
  );
  return useSpring(transform, { stiffness: 100, damping: 30 });
};

/**
 * Hook for mouse position tracking
 * @returns Object containing x and y coordinates
 */
export const useMousePosition = () => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      x.set(event.clientX);
      y.set(event.clientY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [x, y]);

  return { x, y };
};

/**
 * Creates variants that respect reduced motion preferences
 * @param variants Original animation variants
 */
export const createReducedMotionVariants = (variants: Variants): Variants => {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
    };
  }

  return variants;
};