'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { Sword, SwordCategory } from '@/types';
import SwordModal from './SwordModal';

// ============================================================================
// Mock Data
// ============================================================================

const mockSwords: Sword[] = [
  {
    id: '1',
    name: 'Dragon\'s Breath',
    nameJapanese: '龍の息吹',
    category: 'katana',
    price: 12500,
    image: '/swords/katana-1.jpg',
    description: 'A masterfully crafted katana with a dragon-themed hamon pattern. This blade represents the pinnacle of traditional Japanese sword making, combining centuries-old techniques with exceptional artistry.',
    craftsman: 'Master Yoshida',
    era: 'Edo Period',
  },
  {
    id: '2',
    name: 'Moonlight Serenity',
    nameJapanese: '月光の静けさ',
    category: 'katana',
    price: 9800,
    image: '/swords/katana-2.jpg',
    description: 'Elegant katana with a subtle moonlight-inspired hamon. The blade reflects light beautifully, creating an ethereal appearance that captivates collectors and enthusiasts alike.',
    craftsman: 'Master Tanaka',
    era: 'Meiji Period',
  },
  {
    id: '3',
    name: 'Thunder Strike',
    nameJapanese: '雷の一撃',
    category: 'katana',
    price: 15200,
    image: '/swords/katana-3.jpg',
    description: 'Powerful katana with a dramatic lightning-patterned hamon. This blade embodies strength and precision, crafted for the most discerning collectors.',
    craftsman: 'Master Suzuki',
    era: 'Edo Period',
  },
  {
    id: '4',
    name: 'Cherry Blossom',
    nameJapanese: '桜の花',
    category: 'katana',
    price: 11200,
    image: '/swords/katana-4.jpg',
    description: 'Delicate katana featuring a cherry blossom hamon pattern. A beautiful representation of Japanese aesthetics and craftsmanship.',
    craftsman: 'Master Yamamoto',
    era: 'Meiji Period',
  },
  {
    id: '5',
    name: 'Shadow Walker',
    nameJapanese: '影の歩行者',
    category: 'wakizashi',
    price: 6800,
    image: '/swords/wakizashi-1.jpg',
    description: 'Elegant wakizashi with a dark, mysterious aesthetic. Perfect companion blade with exceptional balance and cutting performance.',
    craftsman: 'Master Kobayashi',
    era: 'Edo Period',
  },
  {
    id: '6',
    name: 'Wind Chaser',
    nameJapanese: '風の追跡者',
    category: 'wakizashi',
    price: 7200,
    image: '/swords/wakizashi-2.jpg',
    description: 'Lightweight wakizashi with exceptional handling. The blade moves like wind, offering unparalleled speed and precision.',
    craftsman: 'Master Watanabe',
    era: 'Meiji Period',
  },
  {
    id: '7',
    name: 'Silent Guardian',
    nameJapanese: '静かな守護者',
    category: 'wakizashi',
    price: 6500,
    image: '/swords/wakizashi-3.jpg',
    description: 'Compact wakizashi designed for close-quarters combat. A reliable companion blade with traditional aesthetics.',
    craftsman: 'Master Nakamura',
    era: 'Edo Period',
  },
  {
    id: '8',
    name: 'Flame Dancer',
    nameJapanese: '炎の舞踊者',
    category: 'wakizashi',
    price: 7500,
    image: '/swords/wakizashi-4.jpg',
    description: 'Dynamic wakizashi with a flame-patterned hamon. The blade dances with light, creating a mesmerizing visual effect.',
    craftsman: 'Master Ito',
    era: 'Meiji Period',
  },
  {
    id: '9',
    name: 'Hidden Blade',
    nameJapanese: '隠された刃',
    category: 'tanto',
    price: 3200,
    image: '/swords/tanto-1.jpg',
    description: 'Compact tanto with exceptional sharpness. A perfect utility blade for everyday tasks and collection display.',
    craftsman: 'Master Saito',
    era: 'Edo Period',
  },
  {
    id: '10',
    name: 'Dawn\'s Edge',
    nameJapanese: '夜明けの刃',
    category: 'tanto',
    price: 3800,
    image: '/swords/tanto-2.jpg',
    description: 'Beautiful tanto with a dawn-inspired hamon pattern. The blade captures the essence of morning light.',
    craftsman: 'Master Kato',
    era: 'Meiji Period',
  },
  {
    id: '11',
    name: 'Precision Point',
    nameJapanese: '精密な先端',
    category: 'tanto',
    price: 3500,
    image: '/swords/tanto-3.jpg',
    description: 'Razor-sharp tanto with exceptional point geometry. Designed for precision cutting and detailed work.',
    craftsman: 'Master Matsumoto',
    era: 'Edo Period',
  },
  {
    id: '12',
    name: 'Eternal Flame',
    nameJapanese: '永遠の炎',
    category: 'tanto',
    price: 4200,
    image: '/swords/tanto-4.jpg',
    description: 'Exquisite tanto with a flame-patterned hamon. A small but powerful blade that commands attention.',
    craftsman: 'Master Hayashi',
    era: 'Meiji Period',
  },
];

// ============================================================================
// SwordGallery Component
// ============================================================================

export default function SwordGallery() {
  const [selectedCategory, setSelectedCategory] = useState<SwordCategory | 'all'>('all');
  const [selectedSword, setSelectedSword] = useState<Sword | null>(null);

  const categories: Array<{ label: string; value: SwordCategory | 'all' }> = [
    { label: 'All', value: 'all' },
    { label: 'Katana', value: 'katana' },
    { label: 'Wakizashi', value: 'wakizashi' },
    { label: 'Tanto', value: 'tanto' },
  ];

  const filteredSwords = selectedCategory === 'all'
    ? mockSwords
    : mockSwords.filter((sword) => sword.category === selectedCategory);

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: '#0A0A0A' }}>
      <div className="container mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="mb-12 text-center">
          <h2 className="font-heading mb-4 text-5xl font-bold text-white">
            Our Collection
          </h2>
          <p className="font-body text-lg text-white/70">
            Discover the artistry of traditional Japanese swords
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="mb-12 flex flex-wrap justify-center gap-4">
          {categories.map((category) => (
            <button
              key={category.value}
              onClick={() => setSelectedCategory(category.value)}
              className={cn(
                'px-6 py-3 font-body text-sm uppercase tracking-wider transition-all duration-300',
                'border rounded-lg',
                'focus-visible:outline-2 focus-visible:outline-[#FFD700] focus-visible:outline-offset-2',
                selectedCategory === category.value
                  ? 'border-[#FFD700] bg-[#FFD700]/10 text-[#FFD700]'
                  : 'border-white/20 bg-white/5 text-white/70 hover:border-white/40 hover:text-white'
              )}
              aria-pressed={selectedCategory === category.value}
            >
              {category.label}
            </button>
          ))}
        </div>

        {/* Grid Layout */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedCategory}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"
            style={{
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            }}
          >
            {filteredSwords.map((sword) => (
              <motion.div
                key={sword.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                whileHover={{ scale: 1.03 }}
                className="group cursor-pointer"
                onClick={() => setSelectedSword(sword)}
              >
                <div
                  className={cn(
                    'relative overflow-hidden rounded-lg border transition-all duration-300',
                    'bg-[#1A1A1A]',
                    'group-hover:border-[#FFD700]/50',
                    'group-hover:shadow-[0_0_20px_rgba(255,215,0,0.2)]'
                  )}
                  style={{ aspectRatio: '3/4' }}
                >
                  {/* Image */}
                  <div className="relative h-3/4 w-full overflow-hidden">
                    <Image
                      src={sword.image}
                      alt={`${sword.name} - ${sword.nameJapanese}`}
                      fill
                      loading="lazy"
                      className="object-cover transition-transform duration-300 group-hover:scale-110"
                      style={{ willChange: 'transform' }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  </div>

                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="font-heading mb-2 text-2xl font-bold text-white">
                      {sword.name}
                    </h3>
                    <p className="font-japanese mb-3 text-base text-white/80">
                      {sword.nameJapanese}
                    </p>
                    <p className="font-body text-lg font-semibold text-[#FFD700]">
                      {formatPrice(sword.price)}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Empty State */}
        {filteredSwords.length === 0 && (
          <div className="py-20 text-center">
            <p className="font-body text-lg text-white/70">
              No swords found in this category.
            </p>
          </div>
        )}
      </div>

      {/* Modal */}
      {selectedSword && (
        <SwordModal
          sword={selectedSword}
          onClose={() => setSelectedSword(null)}
        />
      )}
    </section>
  );
}

