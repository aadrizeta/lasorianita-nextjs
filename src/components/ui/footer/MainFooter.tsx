export default function MainFooter() {
    return (
        <div className='padding-responsive col-center gap-20 md:gap-10 md:flex-row md:justify-between lg:items-stretch py-10'>
            <div className='col-center text-center lg:text-start'>
                <span className='font-serif text-4xl mb-6 leading-tight text-soria-cream'>Endulzando tu día desde</span>
                <span className='text-9xl md:text-[10rem] leading-none block -mb-8 md:-mb-12 text-soria-cream font-script opacity-90'>1955</span>
            </div>
            <div className='w-full h-45.25 max-w-md flex flex-col justify-between gap-5'>
                <span className="font-serif text-4xl leading-tight text-soria-cream text-center lg:text-start">Contáctanos</span>
                <div className='flex flex-row justify-between'>
                    <div className='flex flex-col font-sans text-soria-cream'>
                        <span className="md:text-lg">TELÉFONO</span>
                        <a href="tel:+34605467989" className="md:text-xl hover:text-white transition-colors">+34 605 467 989</a>
                    </div>
                    <div className='flex flex-col font-sans text-soria-cream'>
                        <span className="md:text-lg">EMAIL</span>
                        <a href="mailto:info@lasorianita.es" className="md:text-xl hover:text-white transition-colors" target="_blank">info@lasorianita.es</a>
                    </div>
                </div>
                <span className='text-xs text-white/40 font-sans flex justify-between'>© 2024 LA SORIANITA | OBRADOR ARTESANAL</span>
            </div>
        </div>
    );
}
