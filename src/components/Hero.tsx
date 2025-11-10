'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform, useInView, type Variants } from 'framer-motion';
import { cn } from '@/lib/utils';

// ============================================================================
// TypeScript Interfaces
// ============================================================================

export interface HeroProps {
  className?: string;
  backgroundImage?: string;
}

// ============================================================================
// Animation Variants
// ============================================================================

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.5, // Increased delay for more dramatic entrance
      when: 'beforeChildren', // Ensures parent fades in first
    },
  },
};

const letterVariants: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 1.2, // Slower animation for more elegance
      ease: [0.25, 0.1, 0.25, 1], // Custom easing for smoother motion
    },
  },
};

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.6, 0.01, 0.05, 0.95],
    },
  },
};

// ============================================================================
// Hero Component
// ============================================================================

export default function Hero({ className, backgroundImage = '/hero-bg.jpg' }: HeroProps) {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  // Parallax transforms
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

  // Check if hero is in view
  const isInView = useInView(heroRef, { once: true, amount: 0.3 });

  // Split headline into words for stagger animation
  const headlineText = 'Mastering the Art of 伝統';
  const headlineWords = headlineText.split(' ');

  return (
    <section
      ref={heroRef}
      className="relative h-screen w-full overflow-hidden bg-black"
      aria-label="Hero section"
    >
      {/* Background Image with Parallax and Ken Burns Effect */}
      <motion.div
        style={{ opacity, scale, y }}
        className="absolute inset-0 z-0"
        animate={{
          scale: [1, 1.05],
          transition: {
            duration: 20,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "linear"
          }
        }}
      >
        <div
          className="absolute inset-0 bg-gradient-to-br from-[#0A0A0A]/90 via-[#1A1A1A]/80 to-[#0A0A0A]/90 mix-blend-multiply"
          aria-hidden="true"
        />
        <Image
          src={backgroundImage}
          alt=""
          fill
          priority
          quality={100}
          className="object-cover"
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABQODxIPDRQSEBIXFRQdHx0fHRsdHSIgIRwhICEhISwhIyEmICYmJiAmJiMqKioyKiovLzExLy9RUVFRUVFRUVHx/2wBDAhUXFx4XHhsbHh4jIB8gIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIz/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
          aria-hidden="true"
          style={{ willChange: 'transform, opacity' }}
        />
        {/* Cinematic overlay with vignette effect */}
        <div
          className="absolute inset-0 bg-gradient-radial from-transparent to-black/80 opacity-70"
          aria-hidden="true"
        />
        <div 
          className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black/90"
          aria-hidden="true"
        />
      </motion.div>

      {/* Content Container */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="text-center"
        >
          {/* Headline with Stagger Animation */}
          <motion.h1
            className="font-heading mb-6 font-bold text-white"
            style={{
              fontSize: 'clamp(2.5rem, 8vw, 4.5rem)',
              lineHeight: 1.2,
              letterSpacing: '-0.02em',
            }}
          >
            {headlineWords.map((word, wordIndex) => {
              const isAccent = word === '伝統';
              return (
                <span key={wordIndex} className="inline-block mr-2">
                  {word.split('').map((char, charIndex) => (
                    <motion.span
                      key={`${wordIndex}-${charIndex}`}
                      variants={letterVariants}
                      className={cn(
                        'inline-block',
                        isAccent && 'text-[#FFD700]'
                      )}
                      style={{ willChange: 'transform, opacity' }}
                    >
                      {char === ' ' ? '\u00A0' : char}
                    </motion.span>
                  ))}
                </span>
              );
            })}
          </motion.h1>

          {/* Japanese Subtitle */}
          <motion.p
            variants={fadeInUp}
            className="font-japanese mb-12 font-light text-white"
            style={{
              fontSize: 'clamp(1.125rem, 3vw, 1.5rem)',
              letterSpacing: '0.05em',
            }}
          >
            日本刀の芸術
          </motion.p>

          {/* CTA Button */}
          <motion.div variants={fadeInUp}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className={cn(
                'relative overflow-hidden rounded-lg px-8 py-4',
                'font-body text-sm uppercase tracking-wider text-white',
                'border border-[#FFD700]/50',
                'backdrop-blur-md bg-white/10',
                'transition-all duration-300',
                'focus-visible:outline-2 focus-visible:outline-[#FFD700] focus-visible:outline-offset-2',
                'hover:border-[#FFD700] hover:bg-white/20',
                'hover:shadow-[0_0_20px_rgba(255,215,0,0.3)]'
              )}
              style={{
                willChange: 'transform',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
              }}
              aria-label="Explore our collection of Japanese swords"
            >
              <span className="relative z-10">Explore Collection</span>
              {/* Shimmer effect on hover */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                initial={{ x: '-100%' }}
                whileHover={{ x: '100%' }}
                transition={{ duration: 0.6 }}
                style={{ willChange: 'transform' }}
              />
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.6 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          aria-hidden="true"
        >
          <motion.div
            animate={{
              y: [0, 10, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="flex flex-col items-center gap-2"
            style={{ willChange: 'transform' }}
          >
            <span className="font-body text-xs uppercase tracking-widest text-white/60">
              Scroll
            </span>
            <motion.svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-[#FFD700]"
            >
              <motion.path
                d="M7 10L12 15L17 10"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                animate={{
                  pathLength: [0, 1, 0],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                style={{ willChange: 'pathLength' }}
              />
            </motion.svg>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

