import { useState, useRef, useCallback } from 'react';
import { motion, PanInfo, useAnimation } from 'framer-motion';
import Image from 'next/image';
import { useIsMobile } from '@/utils/responsive';

interface CarouselProps {
  images: {
    src: string;
    alt: string;
  }[];
  aspectRatio?: number;
}

const Carousel = ({ images, aspectRatio = 16 / 9 }: CarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const constraintsRef = useRef(null);
  const controls = useAnimation();
  const isMobile = useIsMobile();

  const slideWidth = 100; // percentage
  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  const paginate = useCallback((newDirection: number) => {
    const nextIndex = currentIndex + newDirection;
    if (nextIndex >= 0 && nextIndex < images.length) {
      setCurrentIndex(nextIndex);
      controls.start({
        x: `-${nextIndex * slideWidth}%`,
        transition: { type: 'spring', bounce: 0 }
      });
    }
  }, [currentIndex, controls, images.length]);

  const handleDragEnd = (e: any, { offset, velocity }: PanInfo) => {
    const swipe = swipePower(offset.x, velocity.x);

    if (swipe < -swipeConfidenceThreshold) {
      paginate(1);
    } else if (swipe > swipeConfidenceThreshold) {
      paginate(-1);
    } else {
      // Snap back to current index
      controls.start({
        x: `-${currentIndex * slideWidth}%`,
        transition: { type: 'spring', bounce: 0 }
      });
    }
  };

  return (
    <div className="relative overflow-hidden touch-pan-x" ref={constraintsRef}>
      <motion.div
        drag={isMobile ? 'x' : false}
        dragConstraints={constraintsRef}
        dragElastic={0.2}
        onDragEnd={handleDragEnd}
        animate={controls}
        initial={{ x: 0 }}
        className="flex w-full"
        style={{
          WebkitTapHighlightColor: 'transparent',
          touchAction: 'pan-x',
        }}
      >
        {images.map((image, index) => (
          <div
            key={index}
            className="w-full flex-shrink-0"
            style={{ aspectRatio: String(aspectRatio) }}
          >
            <Image
              src={image.src}
              alt={image.alt}
              className="object-cover"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority={index === 0}
              loading={index === 0 ? 'eager' : 'lazy'}
            />
          </div>
        ))}
      </motion.div>

      {/* Navigation Dots */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setCurrentIndex(index);
              controls.start({
                x: `-${index * slideWidth}%`,
                transition: { type: 'spring', bounce: 0 }
              });
            }}
            className={`w-2 h-2 rounded-full transition-colors
              ${index === currentIndex ? 'bg-gold' : 'bg-white/50'}
              focus:outline-none focus:ring-2 focus:ring-gold
              min-w-[24px] min-h-[24px] touch-manipulation`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Arrow Navigation (Desktop) */}
      {!isMobile && currentIndex > 0 && (
        <button
          onClick={() => paginate(-1)}
          className="absolute left-4 top-1/2 -translate-y-1/2 p-2
            bg-black/50 text-white rounded-full hover:bg-black/75
            focus:outline-none focus:ring-2 focus:ring-gold"
          aria-label="Previous slide"
        >
          ←
        </button>
      )}
      {!isMobile && currentIndex < images.length - 1 && (
        <button
          onClick={() => paginate(1)}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-2
            bg-black/50 text-white rounded-full hover:bg-black/75
            focus:outline-none focus:ring-2 focus:ring-gold"
          aria-label="Next slide"
        >
          →
        </button>
      )}
    </div>
  );
};

export default Carousel;