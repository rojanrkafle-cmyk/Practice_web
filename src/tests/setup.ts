import '@testing-library/jest-dom';
import React from 'react';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      route: '/',
      pathname: '',
      query: {},
      asPath: '',
      push: jest.fn(),
      replace: jest.fn(),
      reload: jest.fn(),
      back: jest.fn(),
      prefetch: jest.fn(),
      beforePopState: jest.fn(),
      events: {
        on: jest.fn(),
        off: jest.fn(),
        emit: jest.fn(),
      },
      isFallback: false,
    };
  },
}));

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: function MockImage({ src, alt, ...props }: any) {
    return React.createElement('img', { 
      src, 
      alt, 
      'data-testid': 'next-image',
      ...props 
    });
  },
}));

// Mock Framer Motion
jest.mock('framer-motion', () => {
  const AnimatePresence = ({ children }: { children: React.ReactNode }) => children;
  const motion = new Proxy(
    {},
    {
      get: (_, prop) => {
        if (prop === '__esModule') return false;
        if (typeof prop !== 'string') return undefined;
        return function MockComponent({ children, ...props }: { children?: React.ReactNode } & Record<string, any>) {
          const Component = prop === 'p' ? 'p' : 'div';
          return React.createElement(Component, {
            'data-testid': `motion-${String(prop)}`,
            ...props,
            initial: undefined,
            animate: undefined,
            exit: undefined,
            transition: undefined,
          }, children);
        };
      },
    }
  );

  const mockValue = { get: () => 0, set: jest.fn(), onChange: jest.fn() };
  const mockInView = { ref: jest.fn(), inView: true, entry: null };

  return {
    motion,
    AnimatePresence,
    useAnimation: () => ({
      start: jest.fn(),
      stop: jest.fn(),
      set: jest.fn(),
    }),
    useInView: () => mockInView,
    useScroll: () => ({ scrollY: mockValue }),
    useMotionValue: () => mockValue,
    useTransform: () => mockValue,
    useMotionValueEvent: jest.fn(),
    useDragControls: () => ({ start: jest.fn(), setOffset: jest.fn(), setTransform: jest.fn() }),
  };
});

// Mock IntersectionObserver
class IntersectionObserverMock {
  observe = jest.fn();
  disconnect = jest.fn();
  unobserve = jest.fn();
}

Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  configurable: true,
  value: IntersectionObserverMock,
});

// Mock ResizeObserver
class ResizeObserverMock {
  observe = jest.fn();
  disconnect = jest.fn();
  unobserve = jest.fn();
}

Object.defineProperty(window, 'ResizeObserver', {
  writable: true,
  configurable: true,
  value: ResizeObserverMock,
});

// Clean up after each test
afterEach(() => {
  jest.clearAllMocks();
});