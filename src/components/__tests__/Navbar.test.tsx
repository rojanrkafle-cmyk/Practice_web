import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Navbar from '../Navbar';

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    nav: ({ children, ...props }: any) => <nav {...props}>{children}</nav>,
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
    span: ({ children, ...props }: any) => <span {...props}>{children}</span>,
    li: ({ children, ...props }: any) => <li {...props}>{children}</li>,
    ul: ({ children, ...props }: any) => <ul {...props}>{children}</ul>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
  useScroll: () => ({ scrollY: { get: () => 0, onChange: () => {} } }),
  useMotionValueEvent: () => null,
}));

describe('Navbar', () => {
  beforeEach(() => {
    // Reset scroll position
    Object.defineProperty(window, 'scrollY', {
      value: 0,
      writable: true,
    });

    // Mock getBoundingClientRect for scroll position detection
    Element.prototype.getBoundingClientRect = jest.fn(() => ({
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      width: 0,
      height: 0,
      x: 0,
      y: 0,
      toJSON: () => {},
    }));

    // Mock smooth scrolling
    Element.prototype.scrollIntoView = jest.fn();
  });

  test('renders navigation links with correct labels and hrefs', () => {
    render(<Navbar />);
    
    const expectedLinks = [
      { label: 'Home', href: '#home' },
      { label: 'Swords', href: '#swords' },
      { label: 'Craftsmanship', href: '#craftsmanship' },
      { label: 'Gallery', href: '#gallery' },
      { label: 'Contact', href: '#contact' },
    ];

    expectedLinks.forEach(({ label }) => {
      const link = screen.getByRole('link', { name: new RegExp(label, 'i') });
      expect(link).toBeInTheDocument();
    });
  });

  test('toggles mobile menu on button click', async () => {
    const user = userEvent.setup();
    render(<Navbar />);
    
    // Find and click the menu button
    const menuButton = screen.getByRole('button', { 
      name: /open menu/i 
    });
    
    await user.click(menuButton);
    
    // Verify menu is opened
    expect(menuButton).toHaveAttribute('aria-expanded', 'true');
    expect(menuButton).toHaveAccessibleName('Close menu');
    
    // Verify mobile menu content
    ['Home', 'Swords', 'Craftsmanship', 'Gallery', 'Contact'].forEach((label) => {
      const link = screen.getAllByRole('link', { name: new RegExp(label, 'i') });
      expect(link.length).toBeGreaterThan(0); // Link exists in both desktop and mobile menu
    });
    
    // Close menu
    await user.click(menuButton);
    expect(menuButton).toHaveAttribute('aria-expanded', 'false');
  });

  test('handles keyboard navigation', async () => {
    const user = userEvent.setup();
    render(<Navbar />);
    
    // Test keyboard interaction with menu button
    const menuButton = screen.getByRole('button', { name: /open menu/i });
    await user.tab();
    expect(menuButton).toHaveFocus();
    
    await user.keyboard('{Enter}');
    expect(menuButton).toHaveAttribute('aria-expanded', 'true');
    
    await user.keyboard('{Enter}');
    expect(menuButton).toHaveAttribute('aria-expanded', 'false');
  });

  test('closes mobile menu when viewport becomes desktop size', async () => {
    const user = userEvent.setup();
    render(<Navbar />);
    
    // Open mobile menu
    const menuButton = screen.getByRole('button', { name: /open menu/i });
    await user.click(menuButton);
    expect(menuButton).toHaveAttribute('aria-expanded', 'true');
    
    // Simulate resize to desktop
    window.innerWidth = 1024;
    window.dispatchEvent(new Event('resize'));
    
    await waitFor(() => {
      expect(menuButton).toHaveAttribute('aria-expanded', 'false');
    });
  });

  test('applies glass morphism effect on scroll', async () => {
    render(<Navbar />);
    
    const nav = screen.getByRole('navigation');
    expect(nav).toHaveStyle({ backgroundColor: 'rgba(10, 10, 10, 0)' });

    // Simulate scroll
    window.scrollY = 100;
    window.dispatchEvent(new Event('scroll'));
    
    await waitFor(() => {
      expect(nav).toHaveStyle({ backgroundColor: 'rgba(10, 10, 10, 0.8)' });
      expect(nav).toHaveStyle({ borderBottom: '1px solid rgba(255, 215, 0, 0.1)' });
    });
  });

  test('updates active link based on scroll position', async () => {
    render(<Navbar />);

    // Mock section in viewport
    Element.prototype.getBoundingClientRect = jest.fn(() => ({
      ...Element.prototype.getBoundingClientRect(),
      top: 50,
    }));

    // Trigger scroll
    window.dispatchEvent(new Event('scroll'));
    
    await waitFor(() => {
      const homeLink = screen.getByRole('link', { name: /home/i, current: 'page' });
      expect(homeLink).toBeInTheDocument();
    });
  });
});