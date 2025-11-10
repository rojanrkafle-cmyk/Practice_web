import { motion, useScroll } from 'framer-motion';
import {
  fadeIn,
  fadeInUp,
  fadeInDown,
  fadeInLeft,
  fadeInRight,
  scaleIn,
  staggerContainer,
  slideUp,
  goldGlow,
  useScrollAnimation,
  useParallax,
  useMousePosition,
} from '@/utils/animations';

const AnimationExamples = () => {
  const { scrollY } = useScroll();
  const { ref: fadeRef, animate: fadeAnimate } = useScrollAnimation();
  const parallaxY = useParallax(scrollY, 100);
  const { x, y } = useMousePosition();

  return (
    <div className="min-h-screen py-20 space-y-32">
      {/* Basic Fade Animations */}
      <section className="space-y-8">
        <h2 className="text-3xl font-bold text-center mb-12">Basic Animations</h2>
        
        <motion.div
          variants={fadeIn}
          initial="initial"
          animate="animate"
          className="p-6 bg-gray-800 rounded-lg"
        >
          Fade In
        </motion.div>

        <motion.div
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          className="p-6 bg-gray-800 rounded-lg"
        >
          Fade In Up
        </motion.div>

        <motion.div
          variants={fadeInDown}
          initial="initial"
          animate="animate"
          className="p-6 bg-gray-800 rounded-lg"
        >
          Fade In Down
        </motion.div>

        <motion.div
          variants={fadeInLeft}
          initial="initial"
          animate="animate"
          className="p-6 bg-gray-800 rounded-lg"
        >
          Fade In Left
        </motion.div>

        <motion.div
          variants={fadeInRight}
          initial="initial"
          animate="animate"
          className="p-6 bg-gray-800 rounded-lg"
        >
          Fade In Right
        </motion.div>
      </section>

      {/* Stagger Animation */}
      <motion.section
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="space-y-4"
      >
        <h2 className="text-3xl font-bold text-center mb-12">Stagger Animation</h2>
        
        {[1, 2, 3, 4].map((item) => (
          <motion.div
            key={item}
            variants={fadeInUp}
            className="p-6 bg-gray-800 rounded-lg"
          >
            Staggered Item {item}
          </motion.div>
        ))}
      </motion.section>

      {/* Scroll-Triggered Animation */}
      <section ref={fadeRef} className="space-y-8">
        <h2 className="text-3xl font-bold text-center mb-12">
          Scroll-Triggered Animation
        </h2>
        
        <motion.div
          variants={scaleIn}
          initial="initial"
          animate={fadeAnimate}
          className="p-6 bg-gray-800 rounded-lg"
        >
          Appears on Scroll
        </motion.div>
      </section>

      {/* Parallax Effect */}
      <section className="h-[50vh] relative overflow-hidden">
        <h2 className="text-3xl font-bold text-center mb-12">Parallax Effect</h2>
        
        <motion.div
          style={{ y: parallaxY }}
          className="p-6 bg-gray-800 rounded-lg absolute inset-x-0 mx-auto w-64"
        >
          Parallax Element
        </motion.div>
      </section>

      {/* Mouse Follow Effect */}
      <section className="h-[50vh] relative">
        <h2 className="text-3xl font-bold text-center mb-12">
          Mouse Follow Effect
        </h2>
        
        <motion.div
          style={{
            x,
            y,
            position: 'absolute',
            top: -25,
            left: -25,
            width: 50,
            height: 50,
          }}
          className="rounded-full bg-gold opacity-50"
        />
      </section>

      {/* Gold Glow Effect */}
      <section className="text-center">
        <h2 className="text-3xl font-bold mb-12">Gold Glow Effect</h2>
        
        <motion.button
          variants={goldGlow}
          initial="initial"
          animate="animate"
          className="px-8 py-3 bg-black text-gold border border-gold rounded-lg"
        >
          Hover Me
        </motion.button>
      </section>
    </div>
  );
};

export default AnimationExamples;