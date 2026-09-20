/**
 * Alérgenos de un producto.
 *
 * Información sensible: se muestra el nombre completo del alérgeno, no sólo el
 * icono, porque de esto depende la salud de quien lo lee. Los iconos van como
 * apoyo visual y quedan ocultos a los lectores de pantalla.
 *
 * Las trazas se separan de los alérgenos presentes: no son lo mismo y
 * confundirlos sería un problema real para un celíaco o un alérgico.
 */

import type { Alergeno } from '@/types/catalogo';
import IconoCatalogo from './icono-catalogo';

interface ListaAlergenosProps {
  /** Códigos del producto (`Producto.alergenos` o `.trazas`). */
  codigos: string[];
  /** Índice código → alérgeno, de `getIndiceAlergenos()`. */
  indice: Record<string, Alergeno>;
  /** `trazas` atenúa el estilo para distinguirlo de un alérgeno presente. */
  variante?: 'presentes' | 'trazas';
  className?: string;
}

export default function ListaAlergenos({
  codigos,
  indice,
  variante = 'presentes',
  className = '',
}: ListaAlergenosProps) {
  if (!codigos.length) return null;

  const esTraza = variante === 'trazas';
  const tono = esTraza
    ? 'border-stone-200 text-stone-500 bg-transparent'
    : 'border-soria-red/20 text-soria-red bg-soria-red/5';

  return (
    <ul className={`flex flex-wrap gap-2 ${className}`}>
      {codigos.map((codigo) => {
        const alergeno = indice[codigo];
        // Si el CMS añade un código que aún no está en la tabla de alérgenos,
        // se muestra el código en crudo antes que ocultar el dato.
        const nombre = alergeno?.nombre ?? codigo;

        return (
          <li key={codigo} className={`chip-alergeno ${tono}`}>
            <IconoCatalogo nombre={alergeno?.icono ?? codigo} tamano={14} />
            <span>{nombre}</span>
          </li>
        );
      })}
    </ul>
  );
}
