/**
 * Ficha completa de producto.
 *
 * Componente de servidor: recibe los datos ya resueltos y sólo delega en
 * cliente la galería. Todo lo que el obrador declara sobre la pieza se ve
 * aquí, con los alérgenos destacados y las trazas claramente separadas.
 */

import type { Alergeno, Categoria, Producto } from '@/types/catalogo';
import { enParrafos, formatearPeso, formatearPrecioConUnidad } from '@/lib/catalogo-formato';
import EtiquetasProducto from '@/components/ui/catalogo/etiquetas-producto';
import ListaAlergenos from '@/components/ui/catalogo/lista-alergenos';
import GaleriaProducto from './galeria-producto';

interface FichaProductoProps {
  producto: Producto;
  categoria: Categoria | null;
  indiceAlergenos: Record<string, Alergeno>;
}

/** Fila de la tabla de características. Se omite sola si no hay valor. */
function Dato({ etiqueta, valor }: { etiqueta: string; valor: string | null }) {
  if (!valor) return null;
  return (
    <div className="flex justify-between gap-6 border-b border-stone-100 py-2.5 last:border-0">
      <dt className="text-sm text-stone-500">{etiqueta}</dt>
      <dd className="text-right text-sm font-medium text-stone-800">{valor}</dd>
    </div>
  );
}

export default function FichaProducto({
  producto,
  categoria,
  indiceAlergenos,
}: FichaProductoProps) {
  const precio = formatearPrecioConUnidad(producto.precio_orientativo, producto.unidad_precio);
  const parrafos = enParrafos(producto.descripcion);

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
      <GaleriaProducto
        imagenes={[producto.imagen, ...producto.galeria]}
        nombre={producto.nombre}
        categoria={categoria}
      />

      <div className="flex flex-col gap-6">
        <header className="flex flex-col gap-3">
          <EtiquetasProducto producto={producto} completo />
          <h1 className="font-serif text-4xl leading-tight text-stone-900 md:text-5xl">
            {producto.nombre}
          </h1>
          {producto.descripcion_corta && (
            <p className="font-math text-lg leading-relaxed text-stone-600">
              {producto.descripcion_corta}
            </p>
          )}
        </header>

        {precio && (
          <div className="flex items-baseline gap-3 border-y border-stone-200 py-4">
            <span className="font-math text-3xl text-soria-red">{precio}</span>
            <span className="text-xs text-stone-400">Precio orientativo</span>
          </div>
        )}

        {parrafos.length > 0 && (
          <div className="flex flex-col gap-3">
            {parrafos.map((parrafo, i) => (
              <p key={i} className="leading-relaxed text-stone-700">
                {parrafo}
              </p>
            ))}
          </div>
        )}

        <dl className="flex flex-col">
          <Dato etiqueta="Formato" valor={producto.formato} />
          <Dato etiqueta="Peso aproximado" valor={formatearPeso(producto.peso_aprox_g)} />
          <Dato etiqueta="Apto para veganos" valor={producto.vegano ? 'Sí' : null} />
        </dl>

        {producto.ingredientes && (
          <section className="flex flex-col gap-2">
            <h2 className="font-serif text-xl text-stone-900">Ingredientes</h2>
            <p className="text-sm leading-relaxed text-stone-600">{producto.ingredientes}</p>
          </section>
        )}

        {(producto.alergenos.length > 0 || producto.trazas.length > 0) && (
          <section className="flex flex-col gap-4 bg-stone-50 p-5">
            <h2 className="font-serif text-xl text-stone-900">Alérgenos</h2>

            {producto.alergenos.length > 0 && (
              <div className="flex flex-col gap-2">
                <h3 className="text-xs uppercase tracking-[0.16em] text-stone-500">Contiene</h3>
                <ListaAlergenos codigos={producto.alergenos} indice={indiceAlergenos} />
              </div>
            )}

            {producto.trazas.length > 0 && (
              <div className="flex flex-col gap-2">
                <h3 className="text-xs uppercase tracking-[0.16em] text-stone-500">
                  Puede contener trazas de
                </h3>
                <ListaAlergenos
                  codigos={producto.trazas}
                  indice={indiceAlergenos}
                  variante="trazas"
                />
              </div>
            )}

            <p className="text-xs leading-relaxed text-stone-500">
              Elaboramos todo en un mismo obrador, así que no podemos garantizar la ausencia total
              de trazas. Si tienes una alergia grave, consúltanos antes de comprar.
            </p>
          </section>
        )}
      </div>
    </div>
  );
}
