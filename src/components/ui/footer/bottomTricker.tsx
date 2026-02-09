'use client';
import { useRef, useEffect, useState } from 'react';


export default function BottomTricker() {
    const stripRef = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const el = stripRef.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => setIsVisible(entry.isIntersecting),
            { threshold: 0 }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    const animationClass = isVisible ? 'scroll-content' : 'scroll-content paused';
    return (
        <div ref={stripRef} className="border-y border-white/20 py-5 overflow-hidden">
            <div className="flex whitespace-nowrap gap-16 items-center select-none">
                <div className={animationClass}>
                    <span className="tricker-text">Horneado cada Mañana</span>
                    <span className="tricker-dot">•</span>
                    <span className="tricker-text">El Sabor de Siempre</span>
                    <span className="tricker-dot">•</span>
                    <span className="tricker-text">Fermentación Lenta 24h</span>
                    <span className="tricker-dot">•</span>
                    <span className="tricker-text">Horneado cada Mañana</span>
                    <span className="tricker-dot">•</span>
                    <span className="tricker-text">El Sabor de Siempre</span>
                    <span className="tricker-dot">•</span>
                    <span className="tricker-text">Fermentación Lenta 24h</span>
                    <span className="tricker-dot">•</span>
                </div>
                <div className={animationClass} aria-hidden="true">
                    <span className="tricker-text">Horneado cada Mañana</span>
                    <span className="tricker-dot">•</span>
                    <span className="tricker-text">El Sabor de Siempre</span>
                    <span className="tricker-dot">•</span>
                    <span className="tricker-text">Fermentación Lenta 24h</span>
                    <span className="tricker-dot">•</span>
                    <span className="tricker-text">Horneado cada Mañana</span>
                    <span className="tricker-dot">•</span>
                    <span className="tricker-text">El Sabor de Siempre</span>
                    <span className="tricker-dot">•</span>
                    <span className="tricker-text">Fermentación Lenta 24h</span>
                    <span className="tricker-dot">•</span>
                </div>
            </div>
        </div>
    );
}