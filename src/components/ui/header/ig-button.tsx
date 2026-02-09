import '@/app/globals.css';

import Link from 'next/link';
export default function IgButton() {
    return (
        <Link href="/catalogo" className='cursor-pointer'>
            <button className='ig-header-button'>CATÁLOGO</button>
        </Link>
    );
}