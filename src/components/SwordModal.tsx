'use client';

import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Sword } from '@/types';

// ============================================================================
// TypeScript Interfaces
// ============================================================================

export interface SwordModalProps {
  sword: Sword;
  onClose: () => void;
}

// ============================================================================
// SwordModal Component
// ============================================================================

export default function SwordModal({ sword, onClose }: SwordModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  // Focus trap and keyboard handling
  useEffect(() => {
    // Store previous focus
    previousFocusRef.current = document.activeElement as HTMLElement;

    // Prevent body scroll
    document.body.style.overflow = 'hidden';

    // Focus modal on open
    if (modalRef.current) {
      modalRef.current.focus();
    }

    // Handle escape key
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    // Handle focus trap
    const handleTab = (event: KeyboardEvent) => {
      if (!modalRef.current) return;

      const focusableElements = modalRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );

      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

      if (event.shiftKey) {
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.addEventListener('keydown', handleTab);

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('keydown', handleTab);
      document.body.style.overflow = 'unset';

      // Restore previous focus
      if (previousFocusRef.current) {
        previousFocusRef.current.focus();
      }
    };
  }, [onClose]);

  // Handle overlay click
  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const modalContent = (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          onClick={handleOverlayClick}
          aria-hidden="true"
        />

        {/* Modal */}
        <motion.div
          ref={modalRef}
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          className="relative z-10 w-full max-w-4xl overflow-hidden rounded-lg bg-[#1A1A1A] border border-white/10"
          style={{ willChange: 'transform, opacity' }}
          tabIndex={-1}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className={cn(
              'absolute right-4 top-4 z-20 rounded-full p-2',
              'bg-black/50 backdrop-blur-sm border border-white/20',
              'text-white transition-all duration-200',
              'hover:bg-black/70 hover:border-[#FFD700]/50',
              'focus-visible:outline-2 focus-visible:outline-[#FFD700] focus-visible:outline-offset-2'
            )}
            aria-label="Close modal"
          >
            <X size={24} />
          </button>

          <div className="flex flex-col lg:flex-row">
            {/* Image Section */}
            <div className="relative h-96 w-full lg:h-auto lg:w-1/2">
              <Image
                src={sword.image}
                alt={`${sword.name} - ${sword.nameJapanese}`}
                fill
                priority
                quality={90}
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            </div>

            {/* Content Section */}
            <div className="flex flex-1 flex-col p-8 lg:p-12">
              {/* Header */}
              <div className="mb-6">
                <h2
                  id="modal-title"
                  className="font-heading mb-2 text-4xl font-bold text-white"
                >
                  {sword.name}
                </h2>
                <p className="font-japanese mb-4 text-xl text-white/80">
                  {sword.nameJapanese}
                </p>
                <p className="font-body text-3xl font-semibold text-[#FFD700]">
                  {formatPrice(sword.price)}
                </p>
              </div>

              {/* Description */}
              <div className="mb-8">
                <p className="font-body text-base leading-relaxed text-white/80">
                  {sword.description}
                </p>
              </div>

              {/* Specifications Table */}
              <div className="mb-8">
                <h3 className="font-heading mb-4 text-xl font-semibold text-white">
                  Specifications
                </h3>
                <table className="w-full">
                  <tbody className="font-body text-sm">
                    <tr className="border-b border-white/10">
                      <td className="py-3 pr-4 text-white/60">Category</td>
                      <td className="py-3 font-semibold capitalize text-white">
                        {sword.category}
                      </td>
                    </tr>
                    <tr className="border-b border-white/10">
                      <td className="py-3 pr-4 text-white/60">Craftsman</td>
                      <td className="py-3 font-semibold text-white">
                        {sword.craftsman}
                      </td>
                    </tr>
                    <tr className="border-b border-white/10">
                      <td className="py-3 pr-4 text-white/60">Era</td>
                      <td className="py-3 font-semibold text-white">
                        {sword.era}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* CTA Button */}
              <button
                onClick={() => {
                  // Handle inquire action
                  onClose();
                }}
                className={cn(
                  'w-full rounded-lg px-8 py-4',
                  'font-body text-sm uppercase tracking-wider text-white',
                  'border border-[#FFD700] bg-[#FFD700]/10',
                  'transition-all duration-300',
                  'hover:bg-[#FFD700]/20 hover:border-[#FFD700]',
                  'hover:shadow-[0_0_20px_rgba(255,215,0,0.3)]',
                  'focus-visible:outline-2 focus-visible:outline-[#FFD700] focus-visible:outline-offset-2'
                )}
                style={{ willChange: 'transform' }}
              >
                Inquire
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );

  // Render modal using portal
  if (typeof window !== 'undefined') {
    return createPortal(modalContent, document.body);
  }

  return null;
}

