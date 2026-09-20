/**
 * Tarjeta de categoría para el índice del catálogo.
 *
 * El color de acento lo define el CMS por categoría, así que se aplica en
 * línea: no puede resolverse con clases de Tailwind generadas en build.
 */

import Link from 'next/link';
import type { Categoria } from '@/types/catalogo';
import ImagenCatalogo from './imagen-catalogo';
import IconoCatalogo from './icono-catalogo';

interface TarjetaCategoriaProps {
  categoria: Categoria;
  /** Cuántos productos publicados tiene, para orientar antes de entrar. */
  numProductos?: number;
  priority?: boolean;
}

export default function TarjetaCategoria({
  categoria,
  numProductos,
  priority = false,
}: TarjetaCategoriaProps) {
  const acento = categoria.color_acento || '#6d1726';

  return (
    <article className="tarjeta-categoria group">
      <Link href={`/catalogo/${categoria.slug}`} className="flex h-full flex-col">
        <div className="relative aspect-3/2 overflow-hidden">
          <ImagenCatalogo
            id={categoria.imagen}
            alt={categoria.nombre}
            colorAcento={categoria.color_acento}
            ancho={800}
            priority={priority}
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
          {/* Banda de acento: el único sitio donde el color del CMS manda. */}
          <span className="absolute inset-x-0 bottom-0 h-1" style={{ backgroundColor: acento }} />
        </div>

        <div className="flex flex-1 flex-col gap-3 p-6">
          <div className="flex items-start justify-between gap-4">
            <h2 className="font-serif text-2xl leading-tight text-stone-900 transition-colors group-hover:text-soria-red md:text-3xl">
              {categoria.nombre}
            </h2>
            <span
              className="shrink-0 rounded-full p-2 transition-transform duration-500 group-hover:-translate-y-0.5"
              style={{ backgroundColor: `${acento}1a`, color: acento }}
            >
              <IconoCatalogo nombre={categoria.icono} tamano={22} />
            </span>
          </div>

          {categoria.descripcion_corta && (
            <p className="text-sm leading-relaxed text-stone-600">{categoria.descripcion_corta}</p>
          )}

          <div className="mt-auto flex items-center justify-between border-t border-stone-100 pt-4">
            {numProductos !== undefined && (
              <span className="text-xs uppercase tracking-[0.16em] text-stone-400">
                {numProductos === 1 ? '1 producto' : `${numProductos} productos`}
              </span>
            )}
            <span className="enlace-catalogo" style={{ color: acento }}>
              Ver categoría
              <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">
                →
              </span>
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}
