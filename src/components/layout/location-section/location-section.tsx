import Image from 'next/image'
import Link from 'next/link'
import GoogleMaps from '@/components/ui/maps/google-maps';

function Location() {
  return (
    <section className='py-5'>
      <div className="flex flex-col-reverse lg:flex-row lg:justify-between gap-8 lg:gap-30 items-center lg:1/2 padding-responsive max-w-380">
        <GoogleMaps />
        <div>
          <h1 className="inline-block text-4xl md:text-7xl text-soria-red border-b border-stone-200 pb-2">
            Encuéntranos
          </h1>
          <div className='mt-5 flex flex-col gap-5'>
            <div className='flex flex-col gap-2'>
              <span className="text-xl md:text-2xl text-soria-red font-bold tracking-tighter flex gap-3">
                <Image src="/icons/ubicacion-borde.svg" alt="Ubicación" width={24} height={24} />
                Ubicación
              </span>
              <Link href="https://www.google.com/maps/dir/?api=1&destination=Panaderia+La+Sorianita&destination_place_id=ChIJt29mtTMmQg0RQ42XzKAjwtUf" className='hover:text-soria-red flex items-center gap-2'>
                Glorieta Sta. María de la Cabeza, 9, Arganzuela, 28045 Madrid ⇗
              </Link>
            </div>
            <div className='flex flex-col gap-2'>
              <div className='flex flex-col gap-1'>
                <span className="text-xl md:text-2xl text-soria-red font-bold tracking-tighter flex gap-3">
                  <Image src="/icons/horario.svg" alt="Horario" width={24} height={24} />
                  Horario
                </span>
                <p>Domingo a Lunes: 8:00 - 21:00</p>
                <p>Sábados: 8:00 - 15:30 / 17:00 - 20:30</p>
              </div>
            </div>
            <span className="pt-5 font-math italic text-lg md:text-xl">
              &ldquo;Ven a visitarnos y déjate llevar por el aroma del pan recién horneado. Un rincón de paz y sabor en el corazón de Madrid.&rdquo;
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Location
