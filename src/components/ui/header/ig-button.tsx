import '@/app/globals.css';

import Link from 'next/link';
export default function IgButton() {
    return (
        <Link href="https://www.instagram.com/pastelerialasorianita/" target='_blank' className='cursor-pointer'>
            <button className='ig-header-button'>SÍGUENOS</button>
        </Link>
    );
}