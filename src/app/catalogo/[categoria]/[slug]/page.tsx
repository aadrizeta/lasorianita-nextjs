import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import {
  getCategoria,
  getIndiceAlergenos,
  getProducto,
  getProductos,
  getRelacionados,
} from '@/lib/catalogo';
import Migas from '@/components/ui/catalogo/migas';
import TarjetaProducto from '@/components/ui/catalogo/tarjeta-producto';
import FichaProducto from '@/components/layout/catalogo/ficha-producto';

interface Props {
  params: Promise<{ categoria: string; slug: string }>;
}

/** Una página estática por producto publicado. */
export async function generateStaticParams() {
  const productos = await getProductos();
  return productos.map((p) => ({ categoria: p.categoria, slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { categoria: slugCategoria, slug } = await params;
  const producto = await getProducto(slug);
  if (!producto) return {};

  const title = producto.seo_title ?? `${producto.nombre} | La Sorianita`;
  const description = producto.seo_description ?? producto.descripcion_corta ?? undefined;
  const url = `https://lasorianita.es/catalogo/${producto.categoria || slugCategoria}/${producto.slug}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, type: 'article' },
  };
}

export default async function PaginaProducto({ params }: Props) {
  const { categoria: slugCategoria, slug } = await params;
  const producto = await getProducto(slug);

  if (!producto) notFound();

  // El slug de categoría de la URL es la fuente de la jerarquía, pero la
  // verdad la tiene el producto. Si alguien llega por la categoría antigua
  // tras un cambio en el CMS, se le manda a la URL buena en vez de dar un 404.
  if (producto.categoria && producto.categoria !== slugCategoria) {
    redirect(`/catalogo/${producto.categoria}/${producto.slug}`);
  }

  const [categoria, indiceAlergenos, relacionados] = await Promise.all([
    getCategoria(producto.categoria),
    getIndiceAlergenos(),
    getRelacionados(producto, 3),
  ]);

  const nombreCategoria = categoria?.nombre ?? producto.categoria_nombre ?? 'Catálogo';

  /**
   * JSON-LD del producto. El precio es orientativo y no hay venta online, así
   * que se declara `Product` sin `offers`: anunciar una oferta que no existe
   * sería incorrecto y Google penaliza los datos que no casan con la página.
   */
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: producto.nombre,
    description: producto.descripcion_corta ?? producto.descripcion ?? undefined,
    category: nombreCategoria,
    brand: { '@type': 'Brand', name: 'La Sorianita' },
    ...(producto.peso_aprox_g
      ? { weight: { '@type': 'QuantitativeValue', value: producto.peso_aprox_g, unitCode: 'GRM' } }
      : {}),
  };

  return (
    <>
      <div className="h-15 md:h-20" />

      <div className="padding-responsive py-8 md:py-12">
        <Migas
          items={[
            { nombre: 'Inicio', href: '/' },
            { nombre: 'Catálogo', href: '/catalogo' },
            { nombre: nombreCategoria, href: `/catalogo/${producto.categoria}` },
            { nombre: producto.nombre },
          ]}
        />
      </div>

      <section className="padding-responsive pb-16 md:pb-24">
        <FichaProducto
          producto={producto}
          categoria={categoria}
          indiceAlergenos={indiceAlergenos}
        />
      </section>

      {relacionados.length > 0 && (
        <section className="border-t border-stone-100 bg-stone-50 py-16">
          <div className="padding-responsive">
            <header className="mb-8 flex flex-wrap items-baseline justify-between gap-3">
              <h2 className="font-serif text-3xl text-stone-900">
                Más de {nombreCategoria.toLowerCase()}
              </h2>
              <Link
                href={`/catalogo/${producto.categoria}`}
                className="text-sm text-soria-red underline underline-offset-4"
              >
                Ver la familia entera
              </Link>
            </header>

            <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relacionados.map((otro) => (
                <li key={otro.id} className="flex">
                  <TarjetaProducto
                    producto={otro}
                    colorAcento={categoria?.color_acento}
                  />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
