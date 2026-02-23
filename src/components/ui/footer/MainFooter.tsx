import Image from "next/image";
import Link from "next/link";

export default function MainFooter() {
  return (
    <div className='padding-responsive col-center gap-20 md:gap-0 md:flex-row md:justify-between lg:items-stretch py-10'>

      <div className='col-center text-center lg:text-start'>
        <span className='font-math text-4xl mb-6 text-soria-cream'>Endulzando tu día desde</span>
        <div className="flex flex-row gap-5 items-end justify-center">
          <span className='text-8xl md:text-[10rem] leading-none block -mb-8 md:-mb-12 text-soria-cream font-script opacity-90 select-none'>1955</span>
          <span className="md:text-2xl md:top-6 md:right-46 text-xl text-soria-cream tracking-[0.3em] font-math right-4 pt-10">EST.</span>
        </div>
      </div>

      <div className='w-full h-45.25 max-w-sm flex flex-col justify-between gap-5 items-center md:items-start'>

        <span className="font-math text-4xl text-soria-cream text-center lg:text-start">Contáctanos</span>

        <div className='flex flex-col gap-2'>
          <div className='font-sans text-soria-cream'>
            <Link className="flex flex-row gap-5" href="tel:+34628150692">
              <Image src="/icons/icono-telefono.svg" alt="Teléfono" width={24} height={24} />
              <span className="text-xl hover:text-white hover:underline transition-colors">628 15 06 92</span>
            </Link>
          </div>
          <div className='font-sans text-soria-cream'>
            <Link className="flex flex-row gap-5" href="mailto:info@lasorianita.es" target="_blank">
              <Image src="/icons/icono-mail.svg" alt="Correo electrónico" width={24} height={24} />
              <span className="text-xl hover:text-white hover:underline transition-colors">info@lasorianita.es</span>
            </Link>
          </div>
          <div className='font-sans text-soria-cream'>
            <Link className="flex flex-row gap-5" href="https://www.instagram.com/pastelerialasorianita/" target="_blank">
              <Image src="/icons/icono-instagram.svg" alt="Instagram" width={24} height={24} />
              <span className="text-xl hover:text-white hover:underline transition-colors">@pastelerialasorianita</span>
            </Link>
          </div>
          {/* <div className='font-sans text-soria-cream'>
            <Link className="flex flex-row gap-5" href="/trabaja-con-nosotros">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <line x1="19" y1="8" x2="19" y2="14" />
                <line x1="22" y1="11" x2="16" y2="11" />
              </svg>
              <span className="text-xl hover:text-white hover:underline transition-colors">Trabaja con nosotros</span>
            </Link>
          </div> */}
        </div>

        <span className='text-xs text-soria-cream font-sans flex justify-between'>© 2024 LA SORIANITA | OBRADOR ARTESANAL</span>

      </div>

    </div>
  );
}
