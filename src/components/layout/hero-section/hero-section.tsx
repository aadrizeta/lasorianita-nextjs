import '@/app/globals.css';
import Image from 'next/image';
import MainButton from '@/components/ui/hero-section/main-button';

export default function HeroSection() {
    return (
        <section className="col-center bg-soria-red min-h-[75vh] gap-15 text-center overflow-hidden">
            <div className='col-center'>
                <h1>
                    <Image src="/logos/Logo-h1.png" alt="La Sorianita - Valor Artesano" width={600} height={300} />
                </h1>
                <div className="w-full flex justify-center items-center gap-4 opacity-80">
                    <div className="side-bars"></div>
                    <p className='text-sm font-light tracking-wider text-white text-inter'>MADRID · CARFT · BAKERY</p>
                    <div className="side-bars"></div>
                </div>
            </div>
            <MainButton />
        </section>
    );
}