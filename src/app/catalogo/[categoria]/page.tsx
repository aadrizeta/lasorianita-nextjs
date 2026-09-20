import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { enParrafos } from '@/lib/catalogo-formato';
import {
  getAlergenos,
  getCategoria,
  getCategorias,
  getProductosDeCategoria,
} from '@/lib/catalogo';
import Migas from '@/components/ui/catalogo/migas';
import IconoCatalogo from '@/components/ui/catalogo/icono-catalogo';
import RejillaProductos from '@/components/layout/catalogo/rejilla-productos';

interface Props {
  params: Promise<{ categoria: string }>;
}

/** Una página estática por categoría publicada. */
export async function generateStaticParams() {
  const categorias = await getCategorias();
  return categorias.map((c) => ({ categoria: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { categoria: slug } = await params;
  const categoria = await getCategoria(slug);
  if (!categoria) return {};

  const title = categoria.seo_title ?? `${categoria.nombre} | La Sorianita`;
  const description = categoria.seo_description ?? categoria.descripcion_corta ?? undefined;

  return {
    title,
    description,
    alternates: { canonical: `https://lasorianita.es/catalogo/${categoria.slug}` },
    openGraph: {
      title,
      description,
      url: `https://lasorianita.es/catalogo/${categoria.slug}`,
    },
  };
}

export default async function PaginaCategoria({ params }: Props) {
  const { categoria: slug } = await params;

  const [categoria, productos, alergenos, categorias] = await Promise.all([
    getCategoria(slug),
    getProductosDeCategoria(slug),
    getAlergenos(),
    getCategorias(),
  ]);

  if (!categoria) notFound();

  const porSlug = Object.fromEntries(categorias.map((c) => [c.slug, c]));
  const acento = categoria.color_acento || '#6d1726';
  const parrafos = enParrafos(categoria.descripcion);

  return (
    <>
      <div className="h-15 md:h-20" />

      {/* Cabecera teñida con el color de acento que define el CMS. */}
      <section className="relative overflow-hidden" style={{ backgroundColor: `${acento}12` }}>
        <div className="padding-responsive flex flex-col gap-6 py-12 md:py-16">
          <Migas
            items={[
              { nombre: 'Inicio', href: '/' },
              { nombre: 'Catálogo', href: '/catalogo' },
              { nombre: categoria.nombre },
            ]}
          />

          <div className="flex items-start gap-5">
            <span
              className="mt-1 shrink-0 rounded-full p-3"
              style={{ backgroundColor: `${acento}22`, color: acento }}
            >
              <IconoCatalogo nombre={categoria.icono} tamano={30} />
            </span>

            <div className="flex flex-col gap-3">
              <h1 className="font-serif text-4xl leading-tight text-stone-900 md:text-6xl">
                {categoria.nombre}
              </h1>
              {categoria.descripcion_corta && (
                <p className="max-w-3xl font-math text-lg leading-relaxed text-stone-700 md:text-2xl">
                  {categoria.descripcion_corta}
                </p>
              )}
            </div>
          </div>

          {parrafos.length > 0 && (
            <div className="flex max-w-3xl flex-col gap-3 md:pl-21">
              {parrafos.map((parrafo, i) => (
                <p key={i} className="leading-relaxed text-stone-600">
                  {parrafo}
                </p>
              ))}
            </div>
          )}
        </div>
        <span className="absolute inset-x-0 bottom-0 h-1" style={{ backgroundColor: acento }} />
      </section>

      <section className="padding-responsive py-12 md:py-16">
        {productos.length > 0 ? (
          <RejillaProductos
            productos={productos}
            categorias={porSlug}
            alergenos={alergenos}
          />
        ) : (
          <p className="py-16 text-center font-math text-xl text-stone-500">
            Todavía no hay productos publicados en esta familia.
          </p>
        )}
      </section>
    </>
  );
}
