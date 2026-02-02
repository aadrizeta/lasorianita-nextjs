import '@/app/globals.css';
import HeroSection from "@/components/layout/hero-section/hero-section";
import ScrollStrip from "@/components/ui/scroll-main/scroll-strip";
import Legado from '@/components/layout/about-us/legado-section';
import Features from '@/components/layout/about-us/features-section';
import Esencia from '@/components/layout/about-us/esencia-section';

export default function Home() {
  return (
    <>
      <HeroSection />
      <ScrollStrip />
      <div className="bg-background py-24">
        <h2 className='col-center gap-2 text-center text-5xl md:text-6xl lg:text-8xl'>
          <section className='text-soria-red'>Nueva Imagen</section>
          <section className='font-math italic'>Sabor de toda la vida</section>
        </h2>
        <div className="w-24 h-0.5 bg-soria-red mx-auto opacity-20 mt-3"></div>
      </div>
      <Legado />
      <Features />
      <Esencia />
    </>
  );
}