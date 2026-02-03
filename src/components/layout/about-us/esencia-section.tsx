import EsenciaImage from '@/components/ui/about-us/esencia-image';

export default function Esencia() {
    return (
        <section className='my-20'>
            <div className='padding-responsive flex flex-col gap-16 lg:flex-row lg:gap-20 justify-between items-center lg:items-start'>
                <EsenciaImage />
                <div className='md:max-w-xl'>
                    <span className='font-serif italic text-soria-red text-xl mb-4 block'>Nuestra esencia</span>
                    <h2 className='font-serif text-6xl md:text-7xl leading-[0.9] text-stone-900 tracking-tight'>
                        <span>Desde 1955</span>
                        <span className='text-soria-red italic'> en el corazón de Madrid</span>
                    </h2>
                    <div className='esencia-group'>
                        <div className='flex flex-col gap-8'>
                            <h3 className='esencia-title'>Un Sueño en Madrid</h3>
                            <p className='esencia-text'>La Sorianita abrió sus puertas por primera vez en Madrid en 1955. Lo que comenzó como un modesto obrador familiar en la zona de Delicias se convirtió pronto en un punto de encuentro para los amantes del buen pan.</p>
                        </div>
                        <div className='flex flex-col gap-8'>
                            <h3 className='esencia-title'>Tres Generaciones</h3>
                            <p className='esencia-text'>A través de las décadas, hemos visto cambiar la ciudad, pero nuestra pasión sigue siendo la misma. Hoy, la tercera generación mantiene vivos los procesos tradicionales.</p>
                        </div>
                    </div>
                    <div className='relative py-8 border-t border-stone-200'>
                        <p className="font-serif italic text-2xl md:text-3xl text-stone-800 leading-snug text-center px-5 mb-6">
                            &quot;El pan no es solo comida, es el lenguaje universal del cariño. Tres generaciones horneando para Madrid.&quot;
                        </p>
                        <p className="text-center text-xs tracking-widest uppercase text-soria-red font-semibold">
                            — La Sorianita Madrid —
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}