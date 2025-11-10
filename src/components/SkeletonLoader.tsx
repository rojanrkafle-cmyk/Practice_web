import { motion } from 'framer-motion';

interface SkeletonProps {
  type?: 'sword' | 'text' | 'image' | 'video';
  width?: string;
  height?: string;
  className?: string;
}

const defaultStyles = {
  sword: 'w-full h-64',
  text: 'w-3/4 h-4',
  image: 'w-full h-48',
  video: 'w-full h-96',
};

import { Variants } from 'framer-motion';

const shimmerAnimation: Variants = {
  initial: { 
    backgroundPosition: '-500px 0',
    opacity: 0.5,
  },
  animate: { 
    backgroundPosition: '500px 0',
    opacity: 1,
    transition: {
      backgroundPosition: {
        repeat: Infinity,
        duration: 1.5,
        ease: 'linear',
      },
      opacity: {
        duration: 0.3,
      }
    }
  }
};

export default function SkeletonLoader({ 
  type = 'text',
  width,
  height,
  className = ''
}: SkeletonProps) {
  return (
    <motion.div
      variants={shimmerAnimation}
      initial="initial"
      animate="animate"
      className={`
        ${width || defaultStyles[type]}
        ${height || ''}
        ${className}
        rounded-lg
        bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900
        bg-[length:1000px_100%]
        animate-shimmer
      `}
    />
  );
}

export const SwordCardSkeleton = () => (
  <div className="p-4 border border-gray-800 rounded-lg bg-black/50">
    <SkeletonLoader type="image" />
    <div className="mt-4 space-y-3">
      <SkeletonLoader type="text" className="w-2/3" />
      <SkeletonLoader type="text" className="w-1/2" />
    </div>
  </div>
);

export const SwordModalSkeleton = () => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
    <div className="w-full max-w-4xl p-6 bg-black border border-gray-800 rounded-lg">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-1/2">
          <SkeletonLoader type="image" className="h-96" />
        </div>
        <div className="w-full md:w-1/2 space-y-4">
          <SkeletonLoader type="text" className="w-3/4" />
          <SkeletonLoader type="text" className="w-1/2" />
          <SkeletonLoader type="text" className="w-full h-32" />
          <SkeletonLoader type="text" className="w-1/3" />
        </div>
      </div>
    </div>
  </div>
);

export const TimelineSkeleton = () => (
  <div className="space-y-8">
    {[...Array(5)].map((_, i) => (
      <div key={i} className="flex gap-4">
        <SkeletonLoader type="image" className="w-24 h-24" />
        <div className="flex-1 space-y-3">
          <SkeletonLoader type="text" className="w-1/3" />
          <SkeletonLoader type="text" className="w-full" />
        </div>
      </div>
    ))}
  </div>
);

export const VideoShowcaseSkeleton = () => (
  <div className="space-y-4">
    <SkeletonLoader type="video" />
    <SkeletonLoader type="text" className="w-1/2" />
    <SkeletonLoader type="text" className="w-3/4" />
  </div>
);