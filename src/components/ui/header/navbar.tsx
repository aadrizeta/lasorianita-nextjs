'use client';
import Link from 'next/link';
import IgButton from './ig-button';
import clsx from 'clsx';
import { usePathname } from 'next/navigation';

const Links = [
  { name: 'inicio', href: '/', external: false },
  { name: 'encuéntranos', href: '/encuentranos', external: false },
  { name: 'síguenos', href: 'https://www.instagram.com/pastelerialasorianita?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==', external: true },
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
      {/* <Link href="/">
        <p className='navlink'>inicio</p>
      </Link>
      <Link href="/encuentranos">
        <p className='navlink'>encuéntranos</p>
      </Link>
      <Link href="https://www.instagram.com/pastelerialasorianita?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==">
        <p className='navlink'>Síguenos</p>
      </Link> */}
      <IgButton />
    </nav>
  );
}