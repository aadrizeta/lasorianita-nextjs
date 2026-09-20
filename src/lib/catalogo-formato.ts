/**
 * Presentación de los datos del catálogo: precios, pesos y texto.
 *
 * Son funciones puras y sin dependencias de React, así que sirven igual en
 * componentes de servidor, de cliente y en la generación de metadatos.
 */

import { SUFIJO_UNIDAD } from '@/types/catalogo';

const FORMATO_EUROS = new Intl.NumberFormat('es-ES', {
  style: 'currency',
  currency: 'EUR',
  minimumFractionDigits: 2,
});

/** "4,50 €". Devuelve null si el producto no tiene precio informado. */
export function formatearPrecio(precio: number | null): string | null {
  if (precio === null) return null;
  return FORMATO_EUROS.format(precio);
}

/** "4,50 € / pieza". El precio es orientativo: no hay venta online. */
export function formatearPrecioConUnidad(
  precio: number | null,
  unidad: string | null,
): string | null {
  const importe = formatearPrecio(precio);
  if (!importe) return null;
  if (!unidad) return importe;
  return `${importe} / ${SUFIJO_UNIDAD[unidad] ?? unidad}`;
}

/** "850 g" o "1,2 kg" según el tamaño. */
export function formatearPeso(gramos: number | null): string | null {
  if (!gramos) return null;
  if (gramos < 1000) return `${gramos} g`;
  const kilos = gramos / 1000;
  const texto = kilos.toLocaleString('es-ES', { maximumFractionDigits: 2 });
  return `${texto} kg`;
}

/**
 * Parte un texto plano en párrafos.
 *
 * El CMS declara `descripcion` como markdown, pero hoy no hay ninguna marca
 * de markdown en los 41 registros: son párrafos sueltos. Se respetan los
 * saltos de línea sin añadir un renderizador ni riesgo de HTML inyectado.
 */
export function enParrafos(texto: string | null): string[] {
  if (!texto) return [];
  return texto
    .split(/\n{2,}|\r\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);
}
