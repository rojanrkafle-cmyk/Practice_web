'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import { cn } from '@/lib/utils';

// ============================================================================
// TypeScript Interfaces
// ============================================================================

export interface NavbarProps {
  className?: string;
}

export interface NavigationItem {
  label: string;
  href: string;
  id: string;
}

// ============================================================================
// Navigation Data
// ============================================================================

const navigationItems: NavigationItem[] = [
  { label: 'Home', href: '#home', id: 'home' },
  { label: 'Swords', href: '#swords', id: 'swords' },
  { label: 'Craftsmanship', href: '#craftsmanship', id: 'craftsmanship' },
  { label: 'Gallery', href: '#gallery', id: 'gallery' },
  { label: 'Contact', href: '#contact', id: 'contact' },
];

// ============================================================================
// Custom Hook for Scroll Position
// ============================================================================

function useScrollY() {
  const { scrollY } = useScroll();
  const [scrollPosition, setScrollPosition] = useState(0);

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setScrollPosition(latest);
  });

  return scrollPosition;
}

// ============================================================================
// Navbar Component
// ============================================================================

export default function Navbar({ className }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState('home');
  const scrollY = useScrollY();
  const isScrolled = scrollY > 50;

  // Handle active link based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      const sections = navigationItems.map((item) => {
        const element = document.querySelector(item.href);
        return {
          id: item.id,
          element,
          top: element?.getBoundingClientRect().top || Infinity,
        };
      });

      const currentSection = sections.find(
        (section) => section.top <= 100 && section.top >= -100
      );

      if (currentSection) {
        setActiveLink(currentSection.id);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change or outside click
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  // Handle keyboard navigation
  const handleKeyDown = (event: React.KeyboardEvent, action: () => void) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      action();
    }
  };

  const handleLinkClick = (href: string, id: string) => {
    setActiveLink(id);
    setIsMobileMenuOpen(false);
    
    // Smooth scroll to section
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className={cn(
        'fixed top-0 left-0 right-0 z-50',
        'transition-all duration-300',
        className
      )}
      style={{
        backdropFilter: isScrolled ? 'blur(12px)' : 'blur(0px)',
        backgroundColor: isScrolled
          ? 'rgba(10, 10, 10, 0.8)'
          : 'rgba(10, 10, 10, 0)',
        borderBottom: isScrolled
          ? '1px solid rgba(255, 215, 0, 0.1)'
          : '1px solid transparent',
      }}
      aria-label="Main navigation"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="flex-shrink-0"
          >
            <a
              href="#home"
              onClick={(e) => {
                e.preventDefault();
                handleLinkClick('#home', 'home');
              }}
              className="font-heading text-[28px] text-[#FFD700] hover:opacity-80 transition-opacity duration-300 focus-visible:outline-2 focus-visible:outline-[#FFD700] focus-visible:outline-offset-2 rounded"
              aria-label="Go to home page"
            >
              Katana
            </a>
          </motion.div>

          {/* Desktop Navigation */}
          <motion.ul
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="hidden md:flex items-center space-x-8 lg:space-x-12"
            role="list"
          >
            {navigationItems.map((item, index) => (
              <motion.li
                key={item.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 + index * 0.05 }}
                className="relative"
              >
                <a
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleLinkClick(item.href, item.id);
                  }}
                  className={cn(
                    'font-body text-sm uppercase tracking-wider text-white',
                    'hover:text-[#FFD700] transition-colors duration-300',
                    'focus-visible:outline-2 focus-visible:outline-[#FFD700] focus-visible:outline-offset-2 rounded',
                    'relative py-2'
                  )}
                  aria-current={activeLink === item.id ? 'page' : undefined}
                >
                  {item.label}
                  {activeLink === item.id && (
                    <motion.span
                      layoutId="activeIndicator"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FFD700]"
                      initial={false}
                      transition={{
                        type: 'spring',
                        stiffness: 380,
                        damping: 30,
                      }}
                      style={{ willChange: 'transform' }}
                    />
                  )}
                </a>
              </motion.li>
            ))}
          </motion.ul>

          {/* Mobile Menu Button */}
          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            onKeyDown={(e) => handleKeyDown(e, () => setIsMobileMenuOpen(!isMobileMenuOpen))}
            className="md:hidden flex flex-col justify-center items-center w-10 h-10 space-y-1.5 focus-visible:outline-2 focus-visible:outline-[#FFD700] focus-visible:outline-offset-2 rounded"
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
          >
            <motion.span
              animate={{
                rotate: isMobileMenuOpen ? 45 : 0,
                y: isMobileMenuOpen ? 8 : 0,
              }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              className="block w-6 h-0.5 bg-white"
              style={{ willChange: 'transform' }}
            />
            <motion.span
              animate={{
                opacity: isMobileMenuOpen ? 0 : 1,
              }}
              transition={{ duration: 0.2 }}
              className="block w-6 h-0.5 bg-white"
            />
            <motion.span
              animate={{
                rotate: isMobileMenuOpen ? -45 : 0,
                y: isMobileMenuOpen ? -8 : 0,
              }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              className="block w-6 h-0.5 bg-white"
              style={{ willChange: 'transform' }}
            />
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
              aria-hidden="true"
            />

            {/* Menu Panel */}
            <motion.div
              id="mobile-menu"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{
                type: 'spring',
                stiffness: 300,
                damping: 30,
              }}
              className="fixed top-20 right-0 bottom-0 w-64 bg-[rgba(10,10,10,0.95)] backdrop-blur-xl border-l border-[rgba(255,215,0,0.1)] z-50 md:hidden overflow-y-auto"
              style={{ willChange: 'transform' }}
            >
              <ul className="flex flex-col py-8 px-6 space-y-6" role="list">
                {navigationItems.map((item, index) => (
                  <motion.li
                    key={item.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <a
                      href={item.href}
                      onClick={(e) => {
                        e.preventDefault();
                        handleLinkClick(item.href, item.id);
                      }}
                      onKeyDown={(e) =>
                        handleKeyDown(e, () => handleLinkClick(item.href, item.id))
                      }
                      className={cn(
                        'font-body text-sm uppercase tracking-wider text-white',
                        'hover:text-[#FFD700] transition-colors duration-300',
                        'focus-visible:outline-2 focus-visible:outline-[#FFD700] focus-visible:outline-offset-2 rounded',
                        'block py-2 relative',
                        activeLink === item.id && 'text-[#FFD700]'
                      )}
                      aria-current={activeLink === item.id ? 'page' : undefined}
                    >
                      {item.label}
                      {activeLink === item.id && (
                        <motion.span
                          layoutId="mobileActiveIndicator"
                          className="absolute left-0 top-0 bottom-0 w-0.5 bg-[#FFD700]"
                          initial={false}
                          transition={{
                            type: 'spring',
                            stiffness: 380,
                            damping: 30,
                          }}
                          style={{ willChange: 'transform' }}
                        />
                      )}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

