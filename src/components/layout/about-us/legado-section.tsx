import '@/app/globals.css'
import Wallpaper from '@/components/ui/about-us/wallpaper';

export default function Legado() {
    return (
        <section>
            <div className='padding-responsive flex flex-col gap-10 md:flex-row justify-between items-center'>
                <div className='col-center gap-10 w-full max-w-lg'>
                    <h2 className='text-5xl md:text-8xl lg:text-9xl text-soria-red flex flex-col items-start'>
                        <span>Legado</span>
                        <span className='ml-12 md:ml-20'>Artesano</span>
                    </h2>
                    <p className='legado-text'>Desde 1955, en La Sorianita hemos mantenido intacta la tradición panadera. Cada mañana, nuestras manos amasan con el mismo cariño que lo hacían nuestros abuelos.</p>
                    <p className='legado-text'>No utilizamos atajos. Fermentaciones lentas, masa madre cultivada por décadas y el respeto absoluto por el tiempo. Porque las cosas buenas no se pueden apresurar NUEVO2</p>
                    <p className='w-full text-start text-soria-red text-4xl md:text-5xl font-script'>Mestros pasteleros</p>
                </div>
                <Wallpaper />
            </div>
        </section>
    );
}