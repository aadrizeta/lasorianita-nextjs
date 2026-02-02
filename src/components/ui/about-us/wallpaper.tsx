import '@/app/globals.css';
import Image from 'next/image';

export default function Wallpaper() {
    return (
        <div className='relative z-10 w-full max-w-lg transform rotate-2 transition-transform hover:rotate-0 duration-700'>
            <div className='absolute inset-0 border border-soria-red/20 translate-x-4 translate-y-4 -z-10'></div>
            <Image
                src="/images/lasorianita-wallpaper.webp"
                alt="La Sorianita | Wallpaper"
                width={384}
                height={700}
                className='block h-auto w-full object-cover shadow-2xl grayscale'
            />
        </div>
    )
}