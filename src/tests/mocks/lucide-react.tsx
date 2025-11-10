import React from 'react';

interface IconProps {
  size?: number;
  className?: string;
  'aria-hidden'?: boolean;
  'aria-label'?: string;
}

const createIconMock = (name: string) => {
  return function IconMock({ size = 24, className, ...props }: IconProps) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        data-testid={`${name}-icon`}
        role="img"
        {...props}
      >
        <rect x="3" y="3" width="18" height="18" rx="2" />
      </svg>
    );
  };
};

export const Loader2 = createIconMock('loader');
export const Menu = createIconMock('menu');
export const X = createIconMock('x');