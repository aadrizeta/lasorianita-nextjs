import Link from 'next/link';
export default function IgButton() {
    return (
        <Link href="/catalogo">
            <button className='ig-header-button'>EXPLORA NUESTRO CATÁLOGO</button>
        </Link>
    );
}