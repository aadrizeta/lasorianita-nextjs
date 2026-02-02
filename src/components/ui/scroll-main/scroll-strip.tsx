'use client';

import { useRef, useEffect, useState } from 'react';

export default function ScrollStrip() {
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
        <div ref={stripRef} className='scroll-strip'>
            <div className={animationClass}>
                <p className='strip-text'>ELABORACIÓN CON MASA MADRE NATURAL</p>
                <span className='strip-dot'>•</span>
                <p className='strip-text'>HARINAS DE PROXIMIDAD</p>
                <span className='strip-dot'>•</span>
                <p className='strip-text'>HORNEADO CADA MAÑANA</p>
                <span className='strip-dot'>•</span>
                <p className='strip-text'>FERMENTACIÓN LENTA 24H</p>
                <span className='strip-dot'>•</span>
                <p className='strip-text'>ELABORACIÓN CON MASA MADRE NATURAL</p>
                <span className='strip-dot'>•</span>
                <p className='strip-text'>HARINAS DE PROXIMIDAD</p>
                <span className='strip-dot'>•</span>
                <p className='strip-text'>HORNEADO CADA MAÑANA</p>
                <span className='strip-dot'>•</span>
                <p className='strip-text'>FERMENTACIÓN LENTA 24H</p>
                <span className='strip-dot'>•</span>
            </div>
            <div className={animationClass} aria-hidden="true">
                <p className='strip-text'>ELABORACIÓN CON MASA MADRE NATURAL</p>
                <span className='strip-dot'>•</span>
                <p className='strip-text'>HARINAS DE PROXIMIDAD</p>
                <span className='strip-dot'>•</span>
                <p className='strip-text'>HORNEADO CADA MAÑANA</p>
                <span className='strip-dot'>•</span>
                <p className='strip-text'>FERMENTACIÓN LENTA 24H</p>
                <span className='strip-dot'>•</span>
                <p className='strip-text'>ELABORACIÓN CON MASA MADRE NATURAL</p>
                <span className='strip-dot'>•</span>
                <p className='strip-text'>HARINAS DE PROXIMIDAD</p>
                <span className='strip-dot'>•</span>
                <p className='strip-text'>HORNEADO CADA MAÑANA</p>
                <span className='strip-dot'>•</span>
                <p className='strip-text'>FERMENTACIÓN LENTA 24H</p>
                <span className='strip-dot'>•</span>
            </div>
        </div>
    );
}