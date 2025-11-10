'use client';

import { ReactNode } from 'react';
import Image from 'next/image';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { cn } from '@/lib/utils';
import { Hammer, FileText, Flame, Sparkles, Package, CheckCircle } from 'lucide-react';

// ============================================================================
// TypeScript Interfaces
// ============================================================================

export interface TimelineStep {
  id: number;
  title: string;
  titleJapanese: string;
  description: string;
  duration: string;
  image: string;
  icon: ReactNode;
}

// ============================================================================
// Timeline Data
// ============================================================================

const timelineSteps: TimelineStep[] = [
  {
    id: 1,
    title: 'Forging',
    titleJapanese: '鍛錬',
    description: 'The raw steel is heated and hammered into shape, creating the foundation of the blade through traditional techniques passed down through generations.',
    duration: '2-3 days',
    image: '/craftsmanship/forging.jpg',
    icon: <Hammer className="w-6 h-6" />,
  },
  {
    id: 2,
    title: 'Shaping',
    titleJapanese: '成形',
    description: 'The blade is carefully shaped and refined, ensuring perfect geometry and balance. Every curve and angle is meticulously crafted.',
    duration: '1-2 days',
    image: '/craftsmanship/shaping.jpg',
    icon: <FileText className="w-6 h-6" />,
  },
  {
    id: 3,
    title: 'Tempering',
    titleJapanese: '焼入れ',
    description: 'The blade undergoes heat treatment to achieve optimal hardness and flexibility. This critical step determines the sword\'s cutting ability and durability.',
    duration: '1 day',
    image: '/craftsmanship/tempering.jpg',
    icon: <Flame className="w-6 h-6" />,
  },
  {
    id: 4,
    title: 'Polishing',
    titleJapanese: '研磨',
    description: 'Master polishers spend weeks refining the blade\'s surface, revealing the beautiful hamon pattern and creating a mirror-like finish.',
    duration: '2-4 weeks',
    image: '/craftsmanship/polishing.jpg',
    icon: <Sparkles className="w-6 h-6" />,
  },
  {
    id: 5,
    title: 'Mounting',
    titleJapanese: '拵',
    description: 'The blade is fitted with a traditional handle, guard, and scabbard. Each component is crafted to complement the blade\'s character.',
    duration: '1-2 weeks',
    image: '/craftsmanship/mounting.jpg',
    icon: <Package className="w-6 h-6" />,
  },
  {
    id: 6,
    title: 'Finishing',
    titleJapanese: '仕上げ',
    description: 'Final quality checks and adjustments ensure the sword meets the highest standards. The masterpiece is complete and ready for its owner.',
    duration: '3-5 days',
    image: '/craftsmanship/finishing.jpg',
    icon: <CheckCircle className="w-6 h-6" />,
  },
];

// ============================================================================
// CraftsmanshipTimeline Component
// ============================================================================

export default function CraftsmanshipTimeline() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  // Progress bar fill based on scroll
  const progressFill = useTransform(scrollYProgress, [0, 1], [0, 100]);

  return (
    <section
      ref={containerRef}
      className="relative py-20 px-4 sm:px-6 lg:px-8"
      style={{ backgroundColor: '#0A0A0A' }}
      aria-label="Craftsmanship timeline"
    >
      <div className="container mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <h2 className="font-heading mb-4 text-5xl font-bold text-white">
            The Art of Craftsmanship
          </h2>
          <p className="font-body text-lg text-white/70">
            Discover the meticulous process behind every masterpiece
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-16 hidden lg:block">
          <div className="relative h-1 w-full overflow-hidden rounded-full bg-white/10">
            <motion.div
              className="absolute left-0 top-0 h-full bg-[#FFD700]"
              style={{
                width: `${progressFill}%`,
                willChange: 'transform',
              }}
            />
          </div>
        </div>

        {/* Timeline Container */}
        <div className="relative">
          {/* Central Vertical Line - Desktop Only */}
          <div className="absolute left-1/2 top-0 hidden h-full w-0.5 -translate-x-1/2 lg:block">
            <div className="h-full w-full bg-[#FFD700]" />
          </div>

          {/* Timeline Steps */}
          <div className="space-y-24 lg:space-y-32" role="list" aria-label="Craftsmanship process steps">
            {timelineSteps.map((step, index) => (
              <div key={step.id} role="listitem">
                <TimelineStepCard
                  step={step}
                  isEven={index % 2 === 0}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// Timeline Step Card Component
// ============================================================================

interface TimelineStepCardProps {
  step: TimelineStep;
  isEven: boolean;
}

function TimelineStepCard({ step, isEven }: TimelineStepCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, {
    once: false,
    amount: 0.3,
  });

  // Animation direction based on position
  const initialX = isEven ? -100 : 100;
  const animateX = 0;

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, x: initialX }}
      whileInView={{ opacity: 1, x: animateX }}
      viewport={{ once: false, amount: 0.3 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={cn(
        'relative flex flex-col lg:flex-row',
        isEven ? 'lg:flex-row' : 'lg:flex-row-reverse',
        'items-center gap-8 lg:gap-12'
      )}
      style={{ willChange: isInView ? 'transform, opacity' : 'auto' }}
    >
      {/* Content Card */}
      <div
        className={cn(
          'relative w-full rounded-2xl border p-6',
          'bg-[#1A1A1A] border-[#FFD700]',
          'lg:w-1/2 lg:p-6',
          isEven ? 'lg:pr-12' : 'lg:pl-12'
        )}
        style={{ padding: '24px' }}
      >
        {/* Duration Badge */}
        <div className="mb-4 inline-block">
          <div className="rounded-lg border border-[#FFD700]/30 bg-white/5 px-4 py-2 backdrop-blur-sm">
            <span className="font-body text-sm font-semibold text-[#FFD700]">
              {step.duration}
            </span>
          </div>
        </div>

        {/* Icon */}
        <div className="mb-4 text-[#FFD700]">{step.icon}</div>

        {/* Title */}
        <h3 className="font-heading mb-2 text-3xl font-bold text-white lg:text-[32px]">
          {step.title}
        </h3>

        {/* Japanese Title */}
        <p className="font-japanese mb-4 text-sm text-white/80 lg:text-[14px]">
          {step.titleJapanese}
        </p>

        {/* Description */}
        <p className="font-body text-base leading-relaxed text-white/70 lg:text-base">
          {step.description}
        </p>
      </div>

      {/* Image Container */}
      <div
        className={cn(
          'relative h-[300px] w-full overflow-hidden rounded-2xl',
          'lg:h-[300px] lg:w-[400px]',
          'border border-white/10'
        )}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[#0A0A0A] via-[#1A1A1A] to-[#0A0A0A]" />
        {step.image && step.image !== '/craftsmanship/forging.jpg' && (
          <Image
            src={step.image}
            alt={`${step.title} - ${step.titleJapanese}`}
            fill
            className="object-cover"
            loading="lazy"
            sizes="(max-width: 1024px) 100vw, 400px"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
      </div>

      {/* Circle Indicator - Desktop Only */}
      <motion.div
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: false, amount: 0.3 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="absolute left-1/2 z-10 hidden h-12 w-12 -translate-x-1/2 items-center justify-center rounded-full border-4 border-[#FFD700] bg-[#0A0A0A] lg:flex"
        style={{ willChange: 'transform' }}
        aria-label={`Step ${step.id}: ${step.title}`}
      >
        <span className="font-heading text-lg font-bold text-[#FFD700]">
          {step.id}
        </span>
      </motion.div>
    </motion.div>
  );
}

