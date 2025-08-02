import Hero from '@/components/Hero';
import Services from '@/components/Services';
import About from '@/components/About';
import Pricing from '@/components/Pricing';
import Reviews from '@/components/Reviews';
import ServiceAreas from '@/components/ServiceAreas';
import ContactForm from '@/components/ContactForm';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Hero />
      <ContactForm />
      <About />
      <Pricing />
      <Reviews />
      <ServiceAreas />
    </div>
  );
} 