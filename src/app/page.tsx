import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import SwordGallery from '@/components/SwordGallery';
import CraftsmanshipTimeline from '@/components/CraftsmanshipTimeline';
import VideoShowcase from '@/components/VideoShowcase';

export default function Home() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0A0A0A' }}>
      <Navbar />
      <Hero />
      
      <section id="swords">
        <VideoShowcase />
      </section>
      
      <section id="craftsmanship">
        <CraftsmanshipTimeline />
      </section>
      
      <section id="gallery">
        <SwordGallery />
      </section>
      
      <section id="contact" className="h-screen flex items-center justify-center">
        <h1 className="font-heading text-6xl" style={{ color: '#FFD700' }}>Contact</h1>
      </section>
    </div>
  );
}
