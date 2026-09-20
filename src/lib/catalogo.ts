/**
 * Capa de datos del catálogo.
 *
 * Aquí viven las consultas a Directus y, sobre todo, la normalización: los
 * componentes reciben `Producto` y `Categoria` ya limpios y nunca ven un
 * precio en string ni un booleano que en realidad es un 1.
 *
 * Con dos llamadas se resuelve casi todo el sitio, así que el listado completo
 * se pide una vez y se filtra en memoria. El `fetch` de Next deduplica las
 * peticiones dentro del mismo render y las cachea entre peticiones.
 */

import { idArchivo, leerColeccion } from '@/lib/directus';
import type {
  Alergeno,
  AlergenoPuenteRaw,
  AlergenoRaw,
  BooleanoRaw,
  Categoria,
  CategoriaRaw,
  CategoriaRelacionRaw,
  Producto,
  ProductoRaw,
} from '@/types/catalogo';

/* ============================================================= */
/* ===================== NORMALIZACIÓN ========================= */
/* ============================================================= */

/** Directus sirve los booleanos de esta instancia como 0 | 1. */
function aBooleano(valor: BooleanoRaw): boolean {
  return valor === true || valor === 1;
}

/** Los decimales llegan como string ("4.50"). */
function aNumero(valor: number | string | null | undefined): number | null {
  if (valor === null || valor === undefined || valor === '') return null;
  const numero = typeof valor === 'number' ? valor : Number(valor);
  return Number.isFinite(numero) ? numero : null;
}

/**
 * Aplana la tabla puente de alérgenos a un array de códigos.
 * La API entrega `[{ alergenos_id: { codigo } }]`.
 */
function aCodigosAlergeno(lista: AlergenoPuenteRaw[] | null | undefined): string[] {
  if (!Array.isArray(lista)) return [];
  return lista
    .map((fila) => {
      const rel = fila?.alergenos_id;
      if (!rel) return null;
      return typeof rel === 'string' ? rel : (rel.codigo ?? null);
    })
    .filter((codigo): codigo is string => Boolean(codigo));
}

/** La M2O de categoría puede venir expandida o como slug suelto. */
function aCategoria(rel: CategoriaRelacionRaw): { slug: string; nombre: string } {
  if (!rel) return { slug: '', nombre: '' };
  if (typeof rel === 'string') return { slug: rel, nombre: '' };
  if (typeof rel === 'number') return { slug: String(rel), nombre: '' };
  return { slug: rel.slug ?? '', nombre: rel.nombre ?? '' };
}

function normalizarCategoria(raw: CategoriaRaw): Categoria {
  return {
    id: raw.id,
    status: raw.status ?? 'published',
    sort: raw.sort ?? null,
    nombre: raw.nombre,
    slug: raw.slug,
    descripcion_corta: raw.descripcion_corta ?? null,
    descripcion: raw.descripcion ?? null,
    imagen: idArchivo(raw.imagen),
    color_acento: raw.color_acento ?? null,
    icono: raw.icono ?? null,
    seo_title: raw.seo_title ?? null,
    seo_description: raw.seo_description ?? null,
  };
}

function normalizarProducto(raw: ProductoRaw): Producto {
  const categoria = aCategoria(raw.categoria ?? null);

  return {
    id: raw.id,
    status: raw.status ?? 'published',
    sort: raw.sort ?? null,
    nombre: raw.nombre,
    slug: raw.slug,
    categoria: categoria.slug,
    categoria_nombre: categoria.nombre,
    descripcion_corta: raw.descripcion_corta ?? null,
    descripcion: raw.descripcion ?? null,
    precio_orientativo: aNumero(raw.precio_orientativo),
    unidad_precio: raw.unidad_precio ?? null,
    formato: raw.formato ?? null,
    peso_aprox_g: raw.peso_aprox_g ?? null,
    alergenos: aCodigosAlergeno(raw.alergenos),
    trazas: aCodigosAlergeno(raw.trazas),
    ingredientes: raw.ingredientes ?? null,
    imagen: idArchivo(raw.imagen),
    galeria: (raw.galeria ?? [])
      .map(idArchivo)
      .filter((id): id is string => Boolean(id)),
    destacado: aBooleano(raw.destacado ?? null),
    vegano: aBooleano(raw.vegano ?? null),
    seo_title: raw.seo_title ?? null,
    seo_description: raw.seo_description ?? null,
    date_created: raw.date_created ?? null,
    date_updated: raw.date_updated ?? null,
  };
}

/* ============================================================= */
/* ======================== CONSULTAS ========================== */
/* ============================================================= */

/**
 * Campos del listado. No se pide `descripcion` ni `ingredientes` porque en una
 * rejilla de 41 productos no se usan y abultan la respuesta.
 */
const CAMPOS_LISTADO = [
  'id',
  'status',
  'sort',
  'nombre',
  'slug',
  'descripcion_corta',
  'precio_orientativo',
  'unidad_precio',
  'formato',
  'peso_aprox_g',
  'destacado',
  'vegano',
  'imagen',
  'date_created',
  'date_updated',
  'categoria.nombre',
  'categoria.slug',
  'alergenos.alergenos_id.codigo',
  'trazas.alergenos_id.codigo',
].join(',');

/** La ficha sí lo pide todo, incluida la galería. */
const CAMPOS_FICHA = [
  '*',
  'categoria.nombre',
  'categoria.slug',
  'alergenos.alergenos_id.codigo',
  'alergenos.alergenos_id.nombre',
  'trazas.alergenos_id.codigo',
  'galeria.directus_files_id',
].join(',');

/**
 * Todas las categorías publicadas, en el orden del CMS.
 * Devuelve [] si el CMS no responde, para que la página muestre su estado
 * vacío en lugar de romper el build.
 */
export async function getCategorias(): Promise<Categoria[]> {
  const datos = await leerColeccion<CategoriaRaw>('categorias', {
    'filter[status][_eq]': 'published',
    sort: 'sort',
    limit: '-1',
  });
  return (datos ?? []).map(normalizarCategoria);
}

export async function getCategoria(slug: string): Promise<Categoria | null> {
  const categorias = await getCategorias();
  return categorias.find((c) => c.slug === slug) ?? null;
}

/**
 * Todo el catálogo publicado, ordenado por categoría y luego por `sort`.
 *
 * El filtro de estado se aplica siempre de forma explícita: el CMS no lo
 * impone en el rol público, así que sin él se colarían los borradores.
 */
export async function getProductos(): Promise<Producto[]> {
  const datos = await leerColeccion<ProductoRaw>('productos', {
    'filter[status][_eq]': 'published',
    sort: 'categoria.sort,sort',
    limit: '-1',
    fields: CAMPOS_LISTADO,
  });
  return (datos ?? []).map(normalizarProducto);
}

/** Productos de una categoría, filtrados sobre el listado ya cacheado. */
export async function getProductosDeCategoria(slugCategoria: string): Promise<Producto[]> {
  const productos = await getProductos();
  return productos.filter((p) => p.categoria === slugCategoria);
}

/** Productos marcados como destacados en el CMS. */
export async function getDestacados(limite?: number): Promise<Producto[]> {
  const destacados = (await getProductos()).filter((p) => p.destacado);
  return limite ? destacados.slice(0, limite) : destacados;
}

/** Ficha completa. Devuelve null si el slug no existe o no está publicado. */
export async function getProducto(slug: string): Promise<Producto | null> {
  const datos = await leerColeccion<ProductoRaw>('productos', {
    'filter[slug][_eq]': slug,
    'filter[status][_eq]': 'published',
    limit: '1',
    fields: CAMPOS_FICHA,
  });
  const raw = datos?.[0];
  return raw ? normalizarProducto(raw) : null;
}

/**
 * Otros productos de la misma categoría, para el bloque final de la ficha.
 */
export async function getRelacionados(producto: Producto, limite = 3): Promise<Producto[]> {
  const hermanos = await getProductosDeCategoria(producto.categoria);
  return hermanos.filter((p) => p.id !== producto.id).slice(0, limite);
}

export async function getAlergenos(): Promise<Alergeno[]> {
  const datos = await leerColeccion<AlergenoRaw>('alergenos', {
    sort: 'sort',
    limit: '-1',
  });
  return (datos ?? []).map((raw) => ({
    id: raw.id,
    codigo: raw.codigo,
    nombre: raw.nombre,
    icono: raw.icono ?? null,
    sort: raw.sort ?? null,
  }));
}

/** Índice código → alérgeno, que es como lo consultan los componentes. */
export async function getIndiceAlergenos(): Promise<Record<string, Alergeno>> {
  const alergenos = await getAlergenos();
  return Object.fromEntries(alergenos.map((a) => [a.codigo, a]));
}
