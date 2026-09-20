/**
 * Tarjeta de producto para las rejillas del catálogo.
 *
 * Muestra lo justo para decidir: foto, nombre, descripción corta, formato y
 * precio orientativo. El detalle completo (ingredientes y alérgenos) vive en
 * la ficha.
 */

import Link from 'next/link';
import type { Producto } from '@/types/catalogo';
import { formatearPrecioConUnidad } from '@/lib/catalogo-formato';
import ImagenCatalogo from './imagen-catalogo';
import EtiquetasProducto from './etiquetas-producto';

interface TarjetaProductoProps {
  producto: Producto;
  /** Color de la categoría, para teñir la reserva de foto pendiente. */
  colorAcento?: string | null;
  /** Las primeras tarjetas de la página cargan su imagen con prioridad. */
  priority?: boolean;
  /** Muestra la categoría dentro de la tarjeta (rejillas mezcladas). */
  mostrarCategoria?: boolean;
}

export default function TarjetaProducto({
  producto,
  colorAcento,
  priority = false,
  mostrarCategoria = false,
}: TarjetaProductoProps) {
  const precio = formatearPrecioConUnidad(producto.precio_orientativo, producto.unidad_precio);

  return (
    <article className="tarjeta-producto group">
      <Link
        href={`/catalogo/${producto.categoria}/${producto.slug}`}
        className="flex h-full flex-col"
      >
        <div className="relative aspect-4/3 overflow-hidden bg-stone-50">
          <ImagenCatalogo
            id={producto.imagen}
            alt={producto.nombre}
            colorAcento={colorAcento}
            ancho={600}
            priority={priority}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
          <EtiquetasProducto producto={producto} className="absolute left-3 top-3" />
        </div>

        <div className="flex flex-1 flex-col gap-2 p-5">
          {mostrarCategoria && producto.categoria_nombre && (
            <span className="text-[11px] uppercase tracking-[0.18em] text-stone-400">
              {producto.categoria_nombre}
            </span>
          )}

          <h3 className="font-serif text-xl leading-tight text-stone-900 transition-colors group-hover:text-soria-red">
            {producto.nombre}
          </h3>

          {producto.descripcion_corta && (
            <p className="line-clamp-3 text-sm leading-relaxed text-stone-600">
              {producto.descripcion_corta}
            </p>
          )}

          {/* El bloque inferior se ancla abajo para que las tarjetas cuadren
              aunque las descripciones tengan distinta longitud. */}
          <div className="mt-auto flex items-end justify-between gap-3 border-t border-stone-100 pt-3">
            {precio ? (
              <span className="font-math text-lg text-soria-red">{precio}</span>
            ) : (
              <span className="text-sm text-stone-400">Consultar</span>
            )}
            {producto.formato && (
              <span className="text-right text-[11px] leading-tight text-stone-400">
                {producto.formato}
              </span>
            )}
          </div>
        </div>
      </Link>
    </article>
  );
}
