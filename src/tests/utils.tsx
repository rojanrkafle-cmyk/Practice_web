import { render as rtlRender } from '@testing-library/react';
import { ReactElement, ReactNode } from 'react';
import userEvent from '@testing-library/user-event';
import { AnimatePresence } from 'framer-motion';
import { act } from 'react-dom/test-utils';

interface CustomWrapperProps {
  children: ReactNode;
}

// Custom wrapper that includes commonly used providers
const CustomWrapper = ({ children }: CustomWrapperProps) => {
  return (
    <AnimatePresence mode="wait">
      {children}
    </AnimatePresence>
  );
};

// Extended render options
interface RenderOptions {
  route?: string;
  initialState?: any;
  [key: string]: any;
}

/**
 * Custom render function that includes the app's providers
 * @param ui - The React element to render
 * @param options - Additional render options
 */
function render(ui: ReactElement, options: RenderOptions = {}) {
  const { route = '/', initialState = {}, ...restOptions } = options;

  window.history.pushState({}, 'Test page', route);

  const wrapper = ({ children }: { children: ReactNode }) => (
    <CustomWrapper>{children}</CustomWrapper>
  );

  return {
    ...rtlRender(ui, { wrapper, ...restOptions }),
  };
}

/**
 * Wait for a specific amount of time
 * @param ms - Time to wait in milliseconds
 */
const wait = (ms: number = 0) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Simulate a window resize event
 * @param width - New window width
 * @param height - New window height
 */
const resizeWindow = (width: number, height: number) => {
  Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: width });
  Object.defineProperty(window, 'innerHeight', { writable: true, configurable: true, value: height });
  window.dispatchEvent(new Event('resize'));
};

/**
 * Simulate a window scroll event
 * @param scrollY - New window scrollY position
 */
const scrollWindow = (scrollY: number) => {
  Object.defineProperty(window, 'scrollY', { writable: true, configurable: true, value: scrollY });
  window.dispatchEvent(new Event('scroll'));
};

/**
 * Mock intersection observer for specific elements
 * @param isIntersecting - Whether the element is intersecting
 * @param element - The element to observe
 */
const mockIntersectionObserver = (isIntersecting: boolean, element?: Element) => {
  const observe = jest.fn();
  const unobserve = jest.fn();
  const disconnect = jest.fn();
  const takeRecords = jest.fn().mockReturnValue([]);

  class MockIntersectionObserver implements IntersectionObserver {
    readonly root: Element | null = null;
    readonly rootMargin: string = '0px';
    readonly thresholds: readonly number[] = [0];

    constructor(private callback: IntersectionObserverCallback) {}

    observe(target: Element) {
      observe(target);
      this.callback(
        [{
          isIntersecting,
          target,
          intersectionRatio: isIntersecting ? 1 : 0,
          boundingClientRect: {} as DOMRectReadOnly,
          intersectionRect: {} as DOMRectReadOnly,
          rootBounds: null,
          time: Date.now(),
        }],
        this
      );
    }

    unobserve = unobserve;
    disconnect = disconnect;
    takeRecords = takeRecords;
  }

  window.IntersectionObserver = MockIntersectionObserver;

  return { observe, unobserve, disconnect };
};

// Re-export everything
export * from '@testing-library/react';

// Export custom utilities
export { 
  render,
  wait,
  resizeWindow,
  scrollWindow,
  mockIntersectionObserver,
  act
};