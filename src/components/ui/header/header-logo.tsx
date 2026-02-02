import '@/app/globals.css';
import Image from 'next/image';
import Link from 'next/link';
export default function HeaderLogo() {
    return (
        <Link className='header-logo' href="/">
            <Image src="/logos/Logo-red.png" alt="Logo | La Sorianita" width={200} height={200} />
            <span className="font-math text-sm uppercase tracking-widest text-soria-red mt-2">Est. 1955</span>
        </Link>
    );
}