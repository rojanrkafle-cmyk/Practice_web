'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX, Maximize, Minimize } from 'lucide-react';
import { cn } from '@/lib/utils';

// ============================================================================
// TypeScript Interfaces
// ============================================================================

export interface VideoShowcaseProps {
  videoSrc?: string;
  videoSrcWebm?: string;
  poster?: string;
  className?: string;
}

interface Statistic {
  label: string;
  value: number;
  suffix?: string;
}

// ============================================================================
// Statistics Data
// ============================================================================

const statistics: Statistic[] = [
  { label: 'Years of Tradition', value: 600, suffix: '+' },
  { label: 'Hours per Blade', value: 50 },
  { label: 'Forging Temperature', value: 1000, suffix: '°C' },
];

// ============================================================================
// VideoShowcase Component
// ============================================================================

export default function VideoShowcase({
  videoSrc = '/videos/craftsmanship.mp4',
  videoSrcWebm = '/videos/craftsmanship.webm',
  poster = '/videos/craftsmanship-poster.jpg',
  className,
}: VideoShowcaseProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);

  // Lazy load video with Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setShouldLoadVideo(true);
            observer.disconnect();
          }
        });
      },
      { rootMargin: '100px' }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Parallax scroll effect
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const parallaxY = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1, 0.8]);

  // Check if stats are in view for count-up animation
  const isStatsInView = useInView(statsRef, { once: true, amount: 0.3 });

  // Video event handlers
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
    }
  };

  // Control functions
  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (videoRef.current && progressRef.current) {
      const rect = progressRef.current.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const width = rect.width;
      const percentage = clickX / width;
      const newTime = percentage * duration;
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      setIsMuted(newVolume === 0);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      if (isMuted) {
        videoRef.current.volume = volume || 0.5;
        setIsMuted(false);
      } else {
        videoRef.current.volume = 0;
        setIsMuted(true);
      }
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement && videoRef.current) {
      videoRef.current.requestFullscreen().then(() => {
        setIsFullscreen(true);
      });
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
      });
    }
  };

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!videoRef.current) return;

      switch (e.key) {
        case ' ':
          e.preventDefault();
          togglePlayPause();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          videoRef.current.currentTime = Math.max(0, currentTime - 10);
          break;
        case 'ArrowRight':
          e.preventDefault();
          videoRef.current.currentTime = Math.min(duration, currentTime + 10);
          break;
        case 'ArrowUp':
          e.preventDefault();
          const newVolumeUp = Math.min(1, volume + 0.1);
          setVolume(newVolumeUp);
          videoRef.current.volume = newVolumeUp;
          setIsMuted(newVolumeUp === 0);
          break;
        case 'ArrowDown':
          e.preventDefault();
          const newVolumeDown = Math.max(0, volume - 0.1);
          setVolume(newVolumeDown);
          videoRef.current.volume = newVolumeDown;
          setIsMuted(newVolumeDown === 0);
          break;
        case 'f':
        case 'F':
          e.preventDefault();
          toggleFullscreen();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, currentTime, duration, volume]);

  // Fullscreen change listener
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Format time helper
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Progress percentage
  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <section
      ref={containerRef}
      className={cn('relative min-h-[80vh] w-full overflow-hidden', className)}
      style={{
        background: 'linear-gradient(to bottom, #0A0A0A, #1A1A1A)',
      }}
      aria-label="Video showcase"
    >
      {/* Video Container with Parallax */}
      <motion.div
        style={{ y: parallaxY, opacity }}
        className="absolute inset-0"
      >
        {shouldLoadVideo ? (
          <video
            ref={videoRef}
            className="h-full w-full object-cover"
            muted={isMuted}
            loop
            playsInline
            preload="metadata"
            poster={poster}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onEnded={handleEnded}
            aria-label="Video player"
          >
            {videoSrcWebm && <source src={videoSrcWebm} type="video/webm" />}
            {videoSrc && <source src={videoSrc} type="video/mp4" />}
            Your browser does not support the video tag.
          </video>
        ) : (
          <div
            className="h-full w-full bg-cover bg-center"
            style={{ backgroundImage: `url(${poster})` }}
            aria-hidden="true"
          />
        )}

        {/* Video Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
      </motion.div>

      {/* Content Overlay */}
      <div className="relative z-10 flex h-full min-h-[80vh] items-center px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto grid w-full grid-cols-1 gap-8 lg:grid-cols-5">
          {/* Text Panel - Left Side */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2"
          >
            <div
              className={cn(
                'rounded-2xl border border-white/20 p-8',
                'backdrop-blur-md bg-white/10',
                'shadow-2xl'
              )}
            >
              <h2 className="font-heading mb-4 text-4xl font-bold text-white lg:text-[48px]">
                Master Craftsmanship
              </h2>
              <p className="font-japanese mb-6 text-lg text-white/90 lg:text-[20px]">
                職人技
              </p>
              <p className="font-body mb-8 text-base leading-relaxed text-white/80 lg:text-[18px]">
                Experience the ancient art of Japanese sword making, where centuries of
                tradition meet unparalleled precision. Each blade is a testament to the
                master craftsman's dedication and skill.
              </p>

              {/* Statistics */}
              <div ref={statsRef} className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-1">
                {statistics.map((stat, index) => (
                  <StatisticItem
                    key={index}
                    stat={stat}
                    isInView={isStatsInView}
                    delay={index * 0.1}
                  />
                ))}
              </div>
            </div>
          </motion.div>

          {/* Spacer for layout */}
          <div className="hidden lg:block lg:col-span-1" />
        </div>
      </div>

      {/* Minimal Video Controls */}
      <div 
        className="absolute bottom-0 left-0 right-0 z-20 opacity-0 transition-opacity duration-300 hover:opacity-100"
        onMouseEnter={() => setIsPlaying(false)}
        onMouseLeave={() => setIsPlaying(true)}
      >
        {/* Ultra-minimal progress bar */}
        <div
          ref={progressRef}
          className="group relative h-1 w-full cursor-pointer bg-black/30 backdrop-blur-sm"
          onClick={handleProgressClick}
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={duration}
          aria-valuenow={currentTime}
          aria-label="Video progress"
        >
          <div
            className="absolute inset-0 origin-left bg-white/20 transition-transform duration-150"
            style={{ 
              transform: `scaleX(${progressPercentage / 100})`,
              willChange: 'transform'
            }}
          />
          <div 
            className="absolute bottom-0 left-0 top-0 origin-left bg-white/50 transition-transform duration-150"
            style={{ 
              transform: `scaleX(${progressPercentage / 100})`,
              willChange: 'transform'
            }}
          />
        </div>
      </div>

      {/* Invisible click area for play/pause */}
      <button
        onClick={togglePlayPause}
        className="absolute inset-0 z-10 h-full w-full cursor-pointer bg-transparent"
        aria-label={isPlaying ? 'Pause video' : 'Play video'}
        aria-pressed={isPlaying}
      />

      {/* Keyboard shortcuts hint - only shown briefly on first interaction */}
      <div 
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg bg-black/80 p-4 text-sm text-white/80 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        role="tooltip"
      >
        Press Space to play/pause<br />
        Arrow keys to seek/adjust volume<br />
        F for fullscreen
      </div>
    </section>
  );
}

// ============================================================================
// Statistic Item Component with Count-Up Animation
// ============================================================================

interface StatisticItemProps {
  stat: Statistic;
  isInView: boolean;
  delay: number;
}

function StatisticItem({ stat, isInView, delay }: StatisticItemProps) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    const duration = 2000; // 2 seconds
    const steps = 60;
    const increment = stat.value / steps;
    const stepDuration = duration / steps;

    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= stat.value) {
        setCount(stat.value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, stepDuration);

    return () => clearInterval(timer);
  }, [isInView, stat.value]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay }}
      className="text-center lg:text-left"
    >
      <div className="font-heading text-3xl font-bold text-[#FFD700]">
        {count}
        {stat.suffix}
      </div>
      <div className="font-body text-sm text-white/70">{stat.label}</div>
    </motion.div>
  );
}

