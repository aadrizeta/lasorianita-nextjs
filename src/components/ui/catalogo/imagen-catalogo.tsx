/**
 * Imagen de catálogo con reserva para cuando aún no hay foto.
 *
 * Hoy el CMS devuelve `imagen: null` en las 7 categorías y los 41 productos
 * (la base de imágenes todavía no está poblada), así que el caso sin foto no
 * es una excepción rara: es lo normal. En lugar de un hueco roto se pinta un
 * icono de imagen sobre el color de acento de la categoría, que se lee como
 * "foto pendiente" y no como un fallo de carga. El día que se suban las fotos
 * este componente empieza a servirlas sin tocar nada más.
 */

import Image from 'next/image';
import { urlImagen } from '@/lib/directus';
import IconoCatalogo from './icono-catalogo';

interface ImagenCatalogoProps {
  /** UUID del asset en Directus, o null si aún no hay foto. */
  id: string | null;
  alt: string;
  /** Hex de acento de la categoría, para teñir la reserva. */
  colorAcento?: string | null;
  /** Ancho solicitado al transformador de Directus. */
  ancho?: number;
  sizes?: string;
  priority?: boolean;
  /** Clases del `<img>`; el contenedor debe aportar posición y tamaño. */
  className?: string;
  /** Tamaño del icono de reserva. Se reduce en las miniaturas. */
  tamanoIcono?: number;
  /** Oculta el texto "Foto en camino" cuando el hueco es pequeño. */
  conLeyenda?: boolean;
}

const ACENTO_POR_DEFECTO = '#6d1726';

export default function ImagenCatalogo({
  id,
  alt,
  colorAcento,
  ancho = 800,
  sizes = '(max-width: 768px) 100vw, 33vw',
  priority = false,
  className = 'object-cover',
  tamanoIcono = 40,
  conLeyenda = true,
}: ImagenCatalogoProps) {
  const src = urlImagen(id, { width: ancho, fit: 'cover' });

  if (src) {
    return (
      <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className={className} />
    );
  }

  const acento = colorAcento || ACENTO_POR_DEFECTO;

  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-center gap-2 overflow-hidden"
      style={{ backgroundColor: `${acento}12` }}
      role="img"
      aria-label={`${alt} (fotografía pendiente)`}
    >
      {/* Trama diagonal muy tenue: da textura sin competir con el icono. */}
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: `repeating-linear-gradient(45deg, ${acento} 0 1px, transparent 1px 10px)`,
        }}
      />

      {/* El icono hereda el color por `currentColor`. */}
      <span className="relative opacity-35" style={{ color: acento }}>
        <IconoCatalogo nombre="imagen" tamano={tamanoIcono} />
      </span>

      {conLeyenda && (
        <span
          className="relative text-[10px] uppercase tracking-[0.18em] opacity-40"
          style={{ color: acento }}
        >
          Foto en camino
        </span>
      )}
    </div>
  );
}
