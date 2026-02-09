'use client';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

const Links = [
    {
        name: 'Inicio',
        href: '/',
        icon: '/icons/casa-borde.svg',
        activeIcon: '/icons/casa-relleno.svg',
    },
    {
        name: 'Encuéntranos',
        href: '/encuentranos',
        icon: '/icons/ubicacion-borde.svg',
        activeIcon: '/icons/ubicacion-relleno.svg',
    },
    {
        name: 'Síguenos',
        href: 'https://www.instagram.com/pastelerialasorianita/',
        icon: '/icons/instagram-borde.svg',
        activeIcon: '/icons/instagram-relleno.svg',
    },
    {
        name: 'Catálogo',
        href: '/catalogo',
        icon: '/icons/catalogo-borde.svg',
        activeIcon: '/icons/catalogo-relleno.svg',
    },
];
interface MobileMenuProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function DropdownNav({ isOpen, onClose }: MobileMenuProps) {

    const pathname = usePathname();
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    return (
        <>
            <nav className={`mobile-menu flex flex-col ${isOpen ? 'translate-y-0' : '-translate-y-full'}`}>
                <ul className='flex flex-col gap-6 p-6 mt-20'>
                    {Links.map((link) => {
                        const isActive = pathname === link.href;
                        return (
                            <li key={link.name} className={`border-b border-soria-red py-2 px-2 rounded-t ${isActive ? 'bg-soria-red-light' : ''}`}>
                                <Link href={link.href}
                                    onClick={onClose}
                                    className={`font-math text-2xl ${isActive ? 'text-soria-red' : 'text-soria-dark'}`}
                                >
                                    <span className='flex gap-5'>
                                        <Image src={isActive ? link.activeIcon : link.icon} alt={link.name} width={24} height={24} />
                                        {link.name}
                                    </span>
                                </Link>
                            </li>
                        );
                    })}

                </ul>
                <div className='flex-1' onClick={onClose} />
            </nav>
        </>
    );
}