'use client';

/**
 * Galería de la ficha de producto.
 *
 * Con una sola imagen (o ninguna, que es el caso hoy) se comporta como una
 * imagen suelta y no pinta miniaturas: no tiene sentido una galería de uno.
 */

import { useState } from 'react';
import type { Categoria } from '@/types/catalogo';
import ImagenCatalogo from '@/components/ui/catalogo/imagen-catalogo';

interface GaleriaProductoProps {
  /** Imagen principal seguida de las de galería. Puede venir vacía. */
  imagenes: (string | null)[];
  nombre: string;
  categoria?: Categoria | null;
}

export default function GaleriaProducto({ imagenes, nombre, categoria }: GaleriaProductoProps) {
  const [activa, setActiva] = useState(0);

  // Sin imágenes se conserva un hueco con el marcador, para que la ficha
  // mantenga su composición a dos columnas.
  const lista = imagenes.length ? imagenes : [null];
  const indice = Math.min(activa, lista.length - 1);

  return (
    <div className="flex flex-col gap-3">
      <div className="relative aspect-4/3 overflow-hidden bg-stone-50 shadow-lg">
        <ImagenCatalogo
          id={lista[indice]}
          alt={nombre}
          colorAcento={categoria?.color_acento}
          ancho={1000}
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          tamanoIcono={52}
        />
      </div>

      {lista.length > 1 && (
        <ul className="flex gap-3">
          {lista.map((imagen, i) => (
            <li key={imagen ?? i}>
              <button
                type="button"
                onClick={() => setActiva(i)}
                aria-label={`Ver imagen ${i + 1} de ${nombre}`}
                aria-current={i === indice}
                className={`relative block h-18 w-18 overflow-hidden border-2 transition-colors ${
                  i === indice ? 'border-soria-red' : 'border-transparent hover:border-stone-300'
                }`}
              >
                <ImagenCatalogo
                  id={imagen}
                  alt=""
                  colorAcento={categoria?.color_acento}
                  ancho={160}
                  sizes="72px"
                  tamanoIcono={20}
                  conLeyenda={false}
                />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
