import Link from 'next/link';
import IgButton from './ig-button';

export default function NavBar() {
    return (
        <nav className='hidden md:flex items-center gap-8'>
            <Link href="#nosotros">
                <p className='text-sm font-medium text-stone-500 hover:text-soria-red transition-colors tracking-wide'>NOSOTROS</p>
            </Link>
            <Link href="#nosotros">
                <p className='text-sm font-medium text-stone-500 hover:text-soria-red transition-colors tracking-wide'>ENCUÉNTRANOS</p>
            </Link>
            <IgButton />
        </nav>
    );
}