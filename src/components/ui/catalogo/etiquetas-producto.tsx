/**
 * Distintivos de un producto: destacado y vegano.
 *
 * Se mantienen discretos a propósito: la rejilla ya tiene mucha información y
 * estas marcas deben leerse de un vistazo sin competir con el nombre.
 */

import type { Producto } from '@/types/catalogo';
import IconoCatalogo from './icono-catalogo';

interface EtiquetasProps {
  producto: Producto;
  /** En la ficha se muestran todas; en la tarjeta sólo las más relevantes. */
  completo?: boolean;
  className?: string;
}

export default function EtiquetasProducto({
  producto,
  completo = false,
  className = '',
}: EtiquetasProps) {
  const etiquetas: { texto: string; icono?: string; tono: string }[] = [];

  if (producto.vegano) {
    etiquetas.push({
      texto: 'Vegano',
      icono: 'vegano',
      tono: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    });
  }

  // En la rejilla, "destacado" no aporta nada: destacan justo los que ya se
  // muestran en su propia sección. En la ficha sí, porque llega gente suelta.
  if (completo && producto.destacado) {
    etiquetas.push({
      texto: 'Destacado',
      tono: 'bg-soria-cream text-soria-red border-soria-cream',
    });
  }

  if (!etiquetas.length) return null;

  return (
    <ul className={`flex flex-wrap gap-1.5 ${className}`}>
      {etiquetas.map((e) => (
        <li key={e.texto} className={`etiqueta-producto ${e.tono}`}>
          {e.icono && <IconoCatalogo nombre={e.icono} tamano={12} />}
          {e.texto}
        </li>
      ))}
    </ul>
  );
}
