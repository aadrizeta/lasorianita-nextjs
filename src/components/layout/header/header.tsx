'use client';
import { useEffect, useState, useRef } from "react";
import NavBar from '@/components/ui/header/navbar';
import HeaderLogo from '@/components/ui/header/header-logo';
import BurgerMenu from "@/components/ui/header/burger-menu";
import DropdownNav from "@/components/layout/header/dropdown-nav";

export default function Header() {

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const lastScrollY = useRef(0);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            if (currentScrollY < lastScrollY.current || currentScrollY < 20) {
                setIsVisible(true);
            } else if (currentScrollY > lastScrollY.current && currentScrollY > 80) {
                setIsVisible(false);
            }

            lastScrollY.current = currentScrollY;
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);
    return (
        <>
            <header className={`header ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}>
                <div className='main-header padding-responsive'>
                    <HeaderLogo />
                    <NavBar />
                    <BurgerMenu isOpen={mobileMenuOpen} onToggle={() => setMobileMenuOpen(!mobileMenuOpen)} />
                </div>
            </header>
            <DropdownNav isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
        </>
    );
}