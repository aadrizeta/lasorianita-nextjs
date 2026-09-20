import type { Metadata } from 'next';
import Link from 'next/link';
import ScrollStrip from '@/components/ui/scroll-main/scroll-strip';
import TarjetaCategoria from '@/components/ui/catalogo/tarjeta-categoria';
import TarjetaProducto from '@/components/ui/catalogo/tarjeta-producto';
import { getCategorias, getDestacados, getProductos } from '@/lib/catalogo';

export const metadata: Metadata = {
  title: 'Catálogo | La Sorianita',
  description:
    'Panes de masa madre, bollería de mantequilla, tartas, galletas y dulces de temporada elaborados a diario en nuestro obrador de Soria.',
  openGraph: {
    title: 'Catálogo | La Sorianita',
    description:
      'Todo lo que sale de nuestro obrador: panes de masa madre, bollería laminada a mano, tartas por encargo y dulces de temporada.',
    url: 'https://lasorianita.es/catalogo',
  },
};

export default async function Catalogo() {
  const [categorias, productos, destacados] = await Promise.all([
    getCategorias(),
    getProductos(),
    getDestacados(6),
  ]);

  /** Cuántos productos publicados cuelgan de cada categoría. */
  const conteo = productos.reduce<Record<string, number>>((acc, producto) => {
    acc[producto.categoria] = (acc[producto.categoria] ?? 0) + 1;
    return acc;
  }, {});

  const porSlug = Object.fromEntries(categorias.map((c) => [c.slug, c]));

  return (
    <>
      <div className="h-15 bg-soria-red md:h-20" />

      <section className="col-center gap-10 bg-soria-red py-15 md:min-h-[60vh] md:gap-16">
        <h1 className="text-center text-6xl leading-[0.9] text-white md:text-8xl">
          El verdadero <span className="italic text-soria-cream">sabor artesanal</span>
        </h1>
        <span className="max-w-250 px-10 text-center font-math text-white md:px-0 md:text-2xl">
          Cada producto que ves aquí está elaborado con materias primas nacionales. Sin atajos, sin
          congelados. Solo el sabor auténtico que llevamos perfeccionando desde 1955.
        </span>
      </section>

      <ScrollStrip />

      <section className="padding-responsive py-16 md:py-24">
        <header className="col-center mb-12 gap-4 text-center">
          <h2 className="font-serif text-4xl text-stone-900 md:text-5xl">Nuestras familias</h2>
          <p className="max-w-2xl leading-relaxed text-stone-600">
            {categorias.length} familias de producto, cada una con su ritmo: lo que sale del horno a
            diario, lo que rota por semanas y lo que sólo hacemos en sus fechas.
          </p>
        </header>

        {categorias.length > 0 ? (
          <ul className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
            {categorias.map((categoria, i) => (
              <li key={categoria.id} className="flex">
                <TarjetaCategoria
                  categoria={categoria}
                  numProductos={conteo[categoria.slug] ?? 0}
                  priority={i < 3}
                />
              </li>
            ))}
          </ul>
        ) : (
          <p className="py-16 text-center font-math text-xl text-stone-500">
            Estamos actualizando el catálogo. Vuelve en un rato.
          </p>
        )}
      </section>

      {destacados.length > 0 && (
        <section className="bg-stone-50 py-16 md:py-24">
          <div className="padding-responsive">
            <header className="col-center mb-12 gap-4 text-center">
              <h2 className="font-serif text-4xl text-stone-900 md:text-5xl">
                Lo que más nos piden
              </h2>
              <p className="max-w-2xl leading-relaxed text-stone-600">
                Las piezas por las que vuelve la gente.
              </p>
            </header>

            <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {destacados.map((producto) => {
                const categoria = porSlug[producto.categoria];
                return (
                  <li key={producto.id} className="flex">
                    <TarjetaProducto
                      producto={producto}
                      colorAcento={categoria?.color_acento}
                      mostrarCategoria
                    />
                  </li>
                );
              })}
            </ul>

            <p className="mt-12 text-center text-sm text-stone-500">
              Los precios son orientativos y pueden variar según formato y temporada. Para encargos,{' '}
              <Link href="/encuentranos" className="text-soria-red underline underline-offset-4">
                pásate por el obrador o llámanos
              </Link>
              .
            </p>
          </div>
        </section>
      )}
    </>
  );
}
