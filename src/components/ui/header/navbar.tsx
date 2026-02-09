import Link from 'next/link';
import IgButton from './ig-button';

export default function NavBar() {
    return (
        <nav className='hidden md:flex items-center gap-8'>
            <Link href="/">
                <p className='text-sm font-medium text-stone-500 hover:text-soria-red transition-colors tracking-wide uppercase'>inicio</p>
            </Link>
            <Link href="/encuentranos">
                <p className='text-sm font-medium text-stone-500 hover:text-soria-red transition-colors tracking-wide uppercase'>encuéntranos</p>
            </Link>
            <Link href="https://www.instagram.com/pastelerialasorianita/" target='_blank'>
                <p className='text-sm font-medium text-stone-500 hover:text-soria-red transition-colors tracking-wide uppercase'>Síguenos</p>
            </Link>
            <IgButton />
        </nav>
    );
}