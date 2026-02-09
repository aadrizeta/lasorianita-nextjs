'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';

interface CarouselImage {
    src: string;
    alt: string;
}

interface CarouselProps {
    images: CarouselImage[];
    interval?: number;
    title?: string;
    description?: string;
}

export default function Carousel({ images, interval = 5000, title, description }: CarouselProps) {
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextSlide = useCallback(() => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
    }, [images.length]);

    useEffect(() => {
        if (images.length <= 1) return;

        const timer = setInterval(nextSlide, interval);
        return () => clearInterval(timer);
    }, [nextSlide, interval, images.length]);

    if (!images.length) return null;

    return (
        <div className="relative padding-responsive pb-16 md:pb-20 mb-25">
            <div className="relative aspect-5/4 md:aspect-video shadow-2xl">
                {/* Contenedor interno solo para las imágenes con overflow-hidden */}
                <div className="absolute inset-0 overflow-hidden">
                    {images.map((image, index) => (
                        <div
                            key={index}
                            className={`absolute inset-0 transition-opacity duration-700 ease-in-out
                        ${index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                        >
                            <div
                                key={`zoom-${index}-${currentIndex}`}
                                className={`w-full h-full ${index === currentIndex ? 'animate-carousel-zoom' : ''}`}
                            >
                                <Image
                                    src={image.src}
                                    alt={image.alt}
                                    fill
                                    priority={index === 0}
                                    className="object-cover object-center"
                                    sizes="100vw"
                                    quality={75}
                                />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Recuadro de título y descripción - fuera del overflow-hidden */}
                {(title || description) && (
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-2/3 md:translate-y-1/2 z-20 bg-soria-red px-4 md:px-8 py-8 w-[90%] text-center shadow-lg max-w-175">
                        {title && <h2 className="font-serif text-soria-cream font-semibold text-3xl md:text-5xl">{title}</h2>}
                        {description && <p className="text-soria-cream text-sm md:text-xl mt-5">{description}</p>}
                    </div>
                )}
            </div>
        </div>
    );
}
