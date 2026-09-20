import '@/app/globals.css';

import Link from 'next/link';
export default function CatalogoButton() {
    return (
        <Link href="/catalogo" className='cursor-pointer'>
            <button className='catalogo-header-button'>CATÁLOGO</button>
        </Link>
    );
}
