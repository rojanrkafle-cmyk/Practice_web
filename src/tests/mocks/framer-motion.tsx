import { ReactNode } from 'react';

interface MotionProps {
  children: ReactNode;
  [key: string]: any;
}

const createMotionComponent = (Component: 'div' | 'p') => {
  return function MotionComponent({ children, ...props }: MotionProps) {
    const filteredProps = Object.keys(props).reduce((acc, key) => {
      if (!['initial', 'animate', 'exit', 'transition', 'layoutId'].includes(key)) {
        acc[key] = props[key];
      }
      return acc;
    }, {} as Record<string, any>);

    return (
      <Component
        data-testid={`motion-${Component}`}
        {...filteredProps}
      >
        {children}
      </Component>
    );
  };
};

export const motion = {
  div: createMotionComponent('div'),
  p: createMotionComponent('p'),
  button: createMotionComponent('div'),
  nav: createMotionComponent('div'),
  form: createMotionComponent('div'),
  section: createMotionComponent('div'),
};

export const AnimatePresence = ({ children }: { children: ReactNode; mode?: string; onExitComplete?: () => void }) => (
  <>{children}</>
);