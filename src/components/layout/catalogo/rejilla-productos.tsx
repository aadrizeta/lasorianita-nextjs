'use client';

/**
 * Rejilla de productos con filtros.
 *
 * El filtrado ocurre en cliente a propósito. El aviso del backend es explícito:
 * un `_nin` sobre la M2M de alérgenos evalúa filas de la tabla puente, no
 * productos, y acaba devolviendo casi todo el catálogo. Como el listado
 * completo son 41 registros que ya vienen con sus códigos de alérgeno, se trae
 * entero una vez y se descarta aquí, que además hace el filtro instantáneo.
 */

import { useMemo, useState } from 'react';
import type { Alergeno, Categoria, Producto } from '@/types/catalogo';
import TarjetaProducto from '@/components/ui/catalogo/tarjeta-producto';
import IconoCatalogo from '@/components/ui/catalogo/icono-catalogo';

interface RejillaProductosProps {
  productos: Producto[];
  /** Índice de categorías por slug, para el icono y el color de cada tarjeta. */
  categorias: Record<string, Categoria>;
  /** Alérgenos que se ofrecen como filtro "sin…". */
  alergenos: Alergeno[];
  /** Oculta la etiqueta de categoría cuando la rejilla ya es de una sola. */
  mostrarCategoria?: boolean;
}

export default function RejillaProductos({
  productos,
  categorias,
  alergenos,
  mostrarCategoria = false,
}: RejillaProductosProps) {
  const [excluidos, setExcluidos] = useState<string[]>([]);
  const [soloVeganos, setSoloVeganos] = useState(false);
  const [incluirTrazas, setIncluirTrazas] = useState(false);

  /** Sólo se ofrecen como filtro los alérgenos presentes en estos productos. */
  const alergenosRelevantes = useMemo(() => {
    const presentes = new Set<string>();
    for (const p of productos) {
      p.alergenos.forEach((c) => presentes.add(c));
    }
    return alergenos.filter((a) => presentes.has(a.codigo));
  }, [productos, alergenos]);

  const visibles = useMemo(() => {
    return productos.filter((producto) => {
      if (soloVeganos && !producto.vegano) return false;

      if (excluidos.length) {
        // `incluirTrazas` endurece el filtro: descarta también los productos
        // que sólo declaran el alérgeno como posible contaminación cruzada.
        const aEvitar = incluirTrazas
          ? [...producto.alergenos, ...producto.trazas]
          : producto.alergenos;
        if (excluidos.some((codigo) => aEvitar.includes(codigo))) return false;
      }

      return true;
    });
  }, [productos, excluidos, soloVeganos, incluirTrazas]);

  function alternarAlergeno(codigo: string) {
    setExcluidos((previos) =>
      previos.includes(codigo) ? previos.filter((c) => c !== codigo) : [...previos, codigo],
    );
  }

  function limpiar() {
    setExcluidos([]);
    setSoloVeganos(false);
    setIncluirTrazas(false);
  }

  const hayFiltros = excluidos.length > 0 || soloVeganos;

  return (
    <div className="flex flex-col gap-8">
      <section aria-label="Filtros" className="panel-filtros">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <h3 className="font-serif text-lg text-stone-900">Filtrar por necesidades</h3>
          {hayFiltros && (
            <button type="button" onClick={limpiar} className="boton-limpiar">
              Quitar filtros
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setSoloVeganos((v) => !v)}
            aria-pressed={soloVeganos}
            className={`chip-filtro ${
              soloVeganos
                ? 'border-emerald-600 bg-emerald-600 text-white'
                : 'border-stone-200 text-stone-600 hover:border-emerald-400'
            }`}
          >
            <IconoCatalogo nombre="vegano" tamano={14} />
            Sólo veganos
          </button>

          {alergenosRelevantes.map((alergeno) => {
            const activo = excluidos.includes(alergeno.codigo);
            return (
              <button
                key={alergeno.codigo}
                type="button"
                onClick={() => alternarAlergeno(alergeno.codigo)}
                aria-pressed={activo}
                className={`chip-filtro ${
                  activo
                    ? 'border-soria-red bg-soria-red text-white'
                    : 'border-stone-200 text-stone-600 hover:border-soria-red/50'
                }`}
              >
                <IconoCatalogo nombre={alergeno.icono ?? alergeno.codigo} tamano={14} />
                Sin {alergeno.nombre.toLowerCase()}
              </button>
            );
          })}
        </div>

        {excluidos.length > 0 && (
          <label className="flex w-fit cursor-pointer items-center gap-2 text-xs text-stone-600">
            <input
              type="checkbox"
              checked={incluirTrazas}
              onChange={(e) => setIncluirTrazas(e.target.checked)}
              className="h-3.5 w-3.5 accent-soria-red"
            />
            Excluir también los productos con trazas
          </label>
        )}

        <p className="text-xs text-stone-500" role="status" aria-live="polite">
          {visibles.length === productos.length
            ? `${productos.length} productos`
            : `${visibles.length} de ${productos.length} productos`}
        </p>
      </section>

      {visibles.length > 0 ? (
        <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visibles.map((producto, i) => {
            const categoria = categorias[producto.categoria];
            return (
              <li key={producto.id} className="flex">
                <TarjetaProducto
                  producto={producto}
                  colorAcento={categoria?.color_acento}
                  priority={i < 3}
                  mostrarCategoria={mostrarCategoria}
                />
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="py-16 text-center font-math text-xl text-stone-500">
          Ningún producto cumple esos filtros. Prueba a quitar alguno.
        </p>
      )}
    </div>
  );
}
