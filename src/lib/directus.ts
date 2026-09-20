/**
 * Acceso de lectura a Directus.
 *
 * El rol público del CMS tiene permiso de lectura, así que no se envía token.
 * La escritura está bloqueada desde el frontend (403): aquí sólo hay GET.
 *
 * Variable de entorno opcional:
 *  - NEXT_PUBLIC_DIRECTUS_URL — para apuntar a otra instancia (local, staging).
 *    Es pública porque las URLs de imagen también se resuelven en cliente.
 */

import type { ArchivoRaw } from '@/types/catalogo';

const URL_POR_DEFECTO = 'https://cms.pacomerlos.com';

export const DIRECTUS_URL = (process.env.NEXT_PUBLIC_DIRECTUS_URL || URL_POR_DEFECTO).replace(
  /\/$/,
  '',
);

/** Cuántos segundos cachea Next las respuestas del catálogo. */
const REVALIDAR_SEGUNDOS = 300;

/** Tag de caché, para poder invalidar el catálogo entero desde un webhook. */
export const TAG_CATALOGO = 'catalogo';

/**
 * Aplana un fichero relacionado a su UUID.
 * Directus lo emite como string, `{ id }` o `{ directus_files_id }` según el
 * interfaz configurado en el campo; la galería usa la tercera forma.
 */
export function idArchivo(archivo: ArchivoRaw | null | undefined): string | null {
  if (!archivo) return null;
  if (typeof archivo === 'string') return archivo || null;
  if ('directus_files_id' in archivo) {
    const anidado = archivo.directus_files_id;
    return typeof anidado === 'string' ? anidado || null : (anidado?.id ?? null);
  }
  return archivo.id ?? null;
}

export interface OpcionesImagen {
  width?: number;
  height?: number;
  /** `cover` recorta al encuadre; `contain` encaja la imagen entera. */
  fit?: 'cover' | 'contain' | 'inside' | 'outside';
  quality?: number;
}

/**
 * Convierte el valor de un campo imagen en una URL para next/image.
 *
 * Devuelve `null` cuando no hay imagen, que hoy es el caso de todo el catálogo
 * (las fotos aún no están subidas al CMS). Los componentes deben tratar ese
 * null y pintar el marcador de posición, no un hueco roto.
 */
export function urlImagen(
  valor: string | null | undefined,
  opciones: OpcionesImagen = {},
): string | null {
  if (!valor) return null;
  // Permite que un campo migrado apunte todavía a un fichero de `public/`.
  if (valor.startsWith('/') || valor.startsWith('http://') || valor.startsWith('https://')) {
    return valor;
  }

  const params = new URLSearchParams();
  if (opciones.width) params.set('width', String(opciones.width));
  if (opciones.height) params.set('height', String(opciones.height));
  if (opciones.fit) params.set('fit', opciones.fit);
  params.set('quality', String(opciones.quality ?? 80));
  params.set('format', 'webp');

  return `${DIRECTUS_URL}/assets/${valor}?${params.toString()}`;
}

/**
 * Lee una colección.
 *
 * Devuelve `null` —en vez de lanzar— cuando la petición falla, para que una
 * caída del CMS no tumbe el build entero ni reviente una página. Quien llama
 * decide qué pintar en ese caso.
 */
export async function leerColeccion<T>(
  coleccion: string,
  params: Record<string, string>,
): Promise<T[] | null> {
  const query = new URLSearchParams(params);
  const url = `${DIRECTUS_URL}/items/${coleccion}?${query.toString()}`;

  try {
    const respuesta = await fetch(url, {
      next: { revalidate: REVALIDAR_SEGUNDOS, tags: [TAG_CATALOGO] },
    });

    if (!respuesta.ok) {
      console.error(`[catalogo] ${coleccion}: la API respondió ${respuesta.status}`);
      return null;
    }

    const cuerpo = (await respuesta.json()) as { data?: T[] };
    return cuerpo.data ?? [];
  } catch (error) {
    console.error(`[catalogo] No se pudo leer la colección "${coleccion}":`, error);
    return null;
  }
}
