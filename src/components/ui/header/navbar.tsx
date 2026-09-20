'use client';
import Link from 'next/link';
import CatalogoButton from './catalogo-button';
import clsx from 'clsx';
import { usePathname } from 'next/navigation';

const Links = [
  { name: 'inicio', href: '/', external: false },
  { name: 'encuéntranos', href: '/encuentranos', external: false },
];

export default function NavBar() {
  const pathname = usePathname();
  return (
    <nav className='hidden md:flex gap-8'>
      <ul className='flex items-center gap-8'>
        {Links.map((link) => {
          const isActive = pathname === link.href;
          return (
            <li key={link.name}>
              <Link href={link.href} target={link.external ? '_blank' : undefined} rel={link.external ? 'noopener noreferrer' : undefined}>
                <p className={clsx('navlink', isActive && 'navlink-active')}>
                  {link.name}
                </p>
              </Link>
            </li>
          );
        })}
      </ul>
      <CatalogoButton />
    </nav>
  );
}
