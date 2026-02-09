import Carousel from "@/components/ui/catalogo/carousel";
import ScrollStrip from "@/components/ui/scroll-main/scroll-strip";

const carouselBolleria = [
    {
        src: '/images/catalogo/carrusel-bolleria/corissants-media-luna.webp',
        alt: 'Croissants media luna | La Sorianita',
    },
    {
        src: '/images/catalogo/carrusel-bolleria/mini-corissants.webp',
        alt: 'Mini Croissants | La Sorianita'
    },
    {
        src: '/images/catalogo/carrusel-bolleria/croissants-La-sorianita.webp',
        alt: 'Croissants | La Sorianita'
    }
];
const carouselReposteria = [
    {
        src: '/images/catalogo/carrusel-reposteria/bizcocho.webp',
        alt: 'Bizcocho | La Sorianita'
    },
    {
        src: '/images/catalogo/carrusel-reposteria/pastelitos.webp',
        alt: 'Pastelitos | La Sorianita'
    },
    {
        src: '/images/catalogo/carrusel-reposteria/tarta-de-frutas.webp',
        alt: 'Tarta de frutas | La Sorianita'
    }
];
const carouselPan = [
    {
        src: '/images/catalogo/carrusel-pan/pan.webp',
        alt: 'Barras de pan de semillas | La Sorianita'
    },
    {
        src: '/images/catalogo/carrusel-pan/pan-de-hogaza.webp',
        alt: 'Pan de hogaza | La Sorianita'
    },
    {
        src: '/images/catalogo/carrusel-pan/pan-con-masa-madre.webp',
        alt: 'Pan con masa madre | La Sorianita'
    },
];


export default function Catalogo() {
    return (
        <>
            <div className="h-15 md:h-20 bg-soria-red" />
            <section className="py-15 md:min-h-[75vh] bg-soria-red col-center gap-10 md:gap-20">
                <h1 className="text-6xl md:text-8xl leading-[0.9] text-white text-center ">El verdadero <span className="text-soria-cream italic">sabor artesanal</span></h1>
                <span className="md:text-2xl font-math text-white px-10 md:px-0 max-w-250 text-center">Cada producto que ves aquí está elaborado con materias primas nacionales. Sin atajos, sin congelados. Solo el sabor auténtico que llevamos perfeccionando desde 1955.</span>
            </section>
            <ScrollStrip />
            <section className="py-15 ">
                <Carousel images={carouselBolleria} title="Bollería" description="Nuestros croissants y medias lunas son el resultado de un proceso artesanal que combina técnicas tradicionales con ingredientes de la más alta calidad." />
                <Carousel images={carouselReposteria} title="Repostería" description="Elaboradas con ingredentes naturales y sin conservantes, cada pieza de nuestra repostería es una obra maestra de sabor y textura." />
                <Carousel images={carouselPan} title="Pan de masa madre" description="Nuestro pan es elaborado con ingredientes naturales y sin conservantes, manteniendo el sabor tradicional que nos ha caracterizado desde hace más de 60 años." />
            </section>
        </>
    );
}