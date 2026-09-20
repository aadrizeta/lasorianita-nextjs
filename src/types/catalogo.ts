/**
 * Contrato de datos del catálogo (Directus 12, https://cms.pacomerlos.com).
 *
 * Dos niveles de tipos:
 *  - `*Raw`: lo que la API devuelve *de verdad*, que no siempre coincide con lo
 *    que uno esperaría. Verificado contra la API en producción:
 *      · `precio_orientativo` llega como string  ("4.50")
 *      · `destacado` / `vegano` llegan como 0 | 1, no booleanos
 *      · `alergenos` / `trazas` llegan con doble salto por la tabla puente
 *      · `galeria` llega como [{ directus_files_id }]
 *  - Tipos limpios: lo que consumen los componentes. La conversión vive en
 *    `@/lib/catalogo`, de modo que ningún componente toca la forma cruda.
 */

/** Cadena abierta: da autocompletado sin rechazar valores nuevos del CMS. */
type Abierto<T extends string> = T | (string & {});

export type EstadoPublicacion = Abierto<'published' | 'draft' | 'archived'>;

/** Valores observados en la colección. Ojo: vienen acentuados desde el CMS. */
export type UnidadPrecio = Abierto<
  'pieza' | 'kg' | 'ración' | 'porción' | 'tarta' | 'caja' | 'bolsa' | 'tableta'
>;

/**
 * Cómo se escribe el precio según la unidad.
 * Es lo que se pinta detrás del importe: "4,50 € / pieza".
 */
export const SUFIJO_UNIDAD: Record<string, string> = {
  pieza: 'pieza',
  kg: 'kg',
  'ración': 'ración',
  'porción': 'porción',
  tarta: 'tarta',
  caja: 'caja',
  bolsa: 'bolsa',
  tableta: 'tableta',
};

/* ============================================================= */
/* ====================== TIPOS LIMPIOS ======================== */
/* ============================================================= */

export interface Alergeno {
  id: number;
  /** Código estable: el que aparece en `Producto.alergenos` y `.trazas`. */
  codigo: string;
  nombre: string;
  icono: string | null;
  sort: number | null;
}

export interface Categoria {
  id: number;
  status: EstadoPublicacion;
  sort: number | null;
  nombre: string;
  slug: string;
  descripcion_corta: string | null;
  descripcion: string | null;
  /** UUID del asset en Directus. Hoy es null en todo el catálogo. */
  imagen: string | null;
  /** Hex de acento. Tiñe la cabecera de categoría y sus marcadores. */
  color_acento: string | null;
  icono: string | null;
  seo_title: string | null;
  seo_description: string | null;
}

export interface Producto {
  id: number;
  status: EstadoPublicacion;
  sort: number | null;
  nombre: string;
  slug: string;
  /** Slug de la categoría, ya aplanado desde la relación M2O. */
  categoria: string;
  /** Nombre de la categoría, para migas de pan y rejillas mezcladas. */
  categoria_nombre: string;
  descripcion_corta: string | null;
  descripcion: string | null;
  /** Ya convertido a número. Informativo: no hay venta online. */
  precio_orientativo: number | null;
  unidad_precio: UnidadPrecio | null;
  formato: string | null;
  peso_aprox_g: number | null;
  /** Códigos de alérgeno presentes, aplanados desde la tabla puente. */
  alergenos: string[];
  /** Códigos de alérgeno por contaminación cruzada. */
  trazas: string[];
  ingredientes: string | null;
  imagen: string | null;
  /** UUIDs de los assets de la galería. */
  galeria: string[];
  destacado: boolean;
  vegano: boolean;
  seo_title: string | null;
  seo_description: string | null;
  /** ISO. Se usa como `lastModified` del sitemap. */
  date_created: string | null;
  date_updated: string | null;
}

/* ============================================================= */
/* ======================= TIPOS CRUDOS ======================== */
/* ============================================================= */

/** Directus envuelve toda respuesta de `/items` en `{ data }`. */
export interface DirectusRespuesta<T> {
  data: T;
}

/** Directus emite booleanos como 0 | 1 en esta instancia. */
export type BooleanoRaw = boolean | 0 | 1 | null;

/** Un fichero relacionado, según cómo esté configurado el campo. */
export type ArchivoRaw =
  | string
  | { id: string }
  | { directus_files_id: string | { id: string } };

/** Entrada de la tabla puente producto ↔ alérgeno. */
export interface AlergenoPuenteRaw {
  alergenos_id?: { codigo?: string | null; nombre?: string | null } | string | null;
}

/** La M2O puede llegar expandida, como slug suelto o como id. */
export type CategoriaRelacionRaw =
  | { nombre?: string | null; slug?: string | null; sort?: number | null }
  | string
  | number
  | null;

export interface AlergenoRaw {
  id: number;
  codigo: string;
  nombre: string;
  icono?: string | null;
  sort?: number | null;
}

export interface CategoriaRaw {
  id: number;
  status?: EstadoPublicacion | null;
  sort?: number | null;
  nombre: string;
  slug: string;
  descripcion_corta?: string | null;
  descripcion?: string | null;
  imagen?: ArchivoRaw | null;
  color_acento?: string | null;
  icono?: string | null;
  seo_title?: string | null;
  seo_description?: string | null;
}

export interface ProductoRaw {
  id: number;
  status?: EstadoPublicacion | null;
  sort?: number | null;
  nombre: string;
  slug: string;
  categoria?: CategoriaRelacionRaw;
  descripcion_corta?: string | null;
  descripcion?: string | null;
  /** Decimal serializado como string por Directus. */
  precio_orientativo?: number | string | null;
  unidad_precio?: UnidadPrecio | null;
  formato?: string | null;
  peso_aprox_g?: number | null;
  alergenos?: AlergenoPuenteRaw[] | null;
  trazas?: AlergenoPuenteRaw[] | null;
  ingredientes?: string | null;
  imagen?: ArchivoRaw | null;
  galeria?: ArchivoRaw[] | null;
  destacado?: BooleanoRaw;
  vegano?: BooleanoRaw;
  seo_title?: string | null;
  seo_description?: string | null;
  date_created?: string | null;
  date_updated?: string | null;
}
