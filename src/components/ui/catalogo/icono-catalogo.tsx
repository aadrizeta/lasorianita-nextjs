/**
 * Iconos del catálogo, en línea y sin dependencias.
 *
 * El CMS guarda el icono como un nombre suelto (`wheat`, `milk`, `croissant`…)
 * en categorías y alérgenos. Aquí se traduce ese nombre a un trazo SVG. Todos
 * comparten rejilla de 24, trazo de 1.5 y `currentColor`, para que hereden el
 * color del contenedor y encajen con la línea gráfica del resto del sitio.
 *
 * Un nombre desconocido cae en un punto neutro en lugar de dejar un hueco.
 */

interface IconoProps {
  /** Valor del campo `icono` del CMS. */
  nombre: string | null | undefined;
  /** Tamaño en píxeles del lado del icono. */
  tamano?: number;
  className?: string;
}

/** Trazos por nombre. Las claves son las que emite el CMS. */
const TRAZOS: Record<string, React.ReactNode> = {
  // ---------- Categorías ----------
  wheat: (
    <>
      <path d="M12 21V9" />
      <path d="M12 9c0-2.5 1.2-4.5 3-5 0 2.5-1.2 4.5-3 5z" />
      <path d="M12 13.5c-2.3 0-4-1.9-4-4.2 2.3 0 4 1.9 4 4.2z" />
      <path d="M12 13.5c2.3 0 4-1.9 4-4.2-2.3 0-4 1.9-4 4.2z" />
      <path d="M12 18c-2.3 0-4-1.9-4-4.2 2.3 0 4 1.9 4 4.2z" />
      <path d="M12 18c2.3 0 4-1.9 4-4.2-2.3 0-4 1.9-4 4.2z" />
    </>
  ),
  grain: (
    <>
      <ellipse cx="8" cy="9" rx="2.4" ry="3.6" transform="rotate(-25 8 9)" />
      <ellipse cx="16" cy="9" rx="2.4" ry="3.6" transform="rotate(25 16 9)" />
      <ellipse cx="12" cy="16" rx="2.4" ry="3.6" />
    </>
  ),
  croissant: (
    <>
      <path d="M3 16c2.2-.6 3.4-2.2 3.4-4.4C6.4 8 9 5.6 12 5.6s5.6 2.4 5.6 6c0 2.2 1.2 3.8 3.4 4.4-2.6 1.8-5.6 2.8-9 2.8s-6.4-1-9-2.8z" />
      <path d="M9.5 7.4 8 17.9" />
      <path d="M14.5 7.4 16 17.9" />
    </>
  ),
  cake: (
    <>
      <path d="M4 20v-5.5c0-1.1.9-2 2-2h12c1.1 0 2 .9 2 2V20" />
      <path d="M3 20h18" />
      <path d="M4 16.2c1.3 0 1.3 1.4 2.7 1.4S8 16.2 9.3 16.2s1.4 1.4 2.7 1.4 1.3-1.4 2.7-1.4 1.3 1.4 2.6 1.4 1.4-1.4 2.7-1.4" />
      <path d="M12 12.5V9" />
      <path d="M12 6.2c.8-.7 1.2-1.4 1.2-2.2 0-.7-.4-1.2-1.2-1.7-.8.5-1.2 1-1.2 1.7 0 .8.4 1.5 1.2 2.2z" />
    </>
  ),
  cookie: (
    <>
      <circle cx="12" cy="12" r="9" />
      <circle cx="9" cy="9.5" r="1.1" />
      <circle cx="15" cy="10.5" r="1.1" />
      <circle cx="11" cy="15" r="1.1" />
      <circle cx="15.5" cy="15" r="0.9" />
    </>
  ),
  calendar: (
    <>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 10h18" />
      <path d="M8 3v4M16 3v4" />
      <circle cx="9" cy="14.5" r="1" />
      <circle cx="15" cy="14.5" r="1" />
    </>
  ),
  pie: (
    <>
      <path d="M3 13a9 9 0 0 1 18 0" />
      <path d="M2.5 13h19" />
      <path d="M21 13a9 9 0 0 1-18 0" opacity="0" />
      <path d="M7 13a5 5 0 0 1 10 0" />
      <path d="M12 8v5" />
      <path d="M3 13v1.8c0 2.3 4 4.2 9 4.2s9-1.9 9-4.2V13" />
    </>
  ),

  // ---------- Alérgenos ----------
  gluten: (
    <>
      <path d="M12 21V8" />
      <path d="M12 12.8c-2.2 0-3.9-1.8-3.9-4 2.2 0 3.9 1.8 3.9 4z" />
      <path d="M12 12.8c2.2 0 3.9-1.8 3.9-4-2.2 0-3.9 1.8-3.9 4z" />
      <path d="M12 17.4c-2.2 0-3.9-1.8-3.9-4 2.2 0 3.9 1.8 3.9 4z" />
      <path d="M12 17.4c2.2 0 3.9-1.8 3.9-4-2.2 0-3.9 1.8-3.9 4z" />
      <path d="M12 8c0-2.4 1.1-4.3 2.9-4.8 0 2.4-1.1 4.3-2.9 4.8z" />
    </>
  ),
  egg: <path d="M12 21c-3.3 0-6-2.5-6-5.9C6 10.5 8.7 3 12 3s6 7.5 6 12.1c0 3.4-2.7 5.9-6 5.9z" />,
  milk: (
    <>
      <path d="M8 2h8" />
      <path d="M9 2v3.2L7 8.6c-.4.6-.6 1.3-.6 2V20c0 .6.4 1 1 1h9.2c.6 0 1-.4 1-1V10.6c0-.7-.2-1.4-.6-2L15 5.2V2" />
      <path d="M6.6 12.5h10.8" />
    </>
  ),
  nut: (
    <>
      <path d="M12 21c-4 0-7-3.1-7-7.4C5 8.8 8.1 3 12 3s7 5.8 7 10.6C19 17.9 16 21 12 21z" />
      <path d="M12 3.4v17.2" />
      <path d="M8 8.5c1.6 1 2.6 2.4 3 4.2M16 8.5c-1.6 1-2.6 2.4-3 4.2" />
    </>
  ),
  peanut: (
    <>
      <path d="M15.6 11.8c1.3-.9 2-2.2 2-3.7 0-2.6-2.2-4.7-4.9-4.7-2.4 0-4.4 1.7-4.8 3.9-.3 1.6-1 2.4-2 3.3C4.6 11.7 4 13.1 4 14.7c0 3 2.5 5.4 5.6 5.4 2.7 0 5-1.9 5.5-4.5.2-1.4.6-2.6 1.5-3.4z" />
      <path d="M9.2 10.9c1.5.6 2.6 1.7 3.2 3.2" />
    </>
  ),
  soy: (
    <>
      <path d="M5.5 8.5c0-2.2 1.8-4 4-4h5c2.2 0 4 1.8 4 4s-1.8 4-4 4h-5c-2.2 0-4-1.8-4-4z" transform="rotate(35 12 8.5)" />
      <circle cx="10" cy="10.2" r="1.3" />
      <circle cx="13.2" cy="13.4" r="1.3" />
      <path d="M6.4 6.2 4.6 4.4" />
    </>
  ),
  sesame: (
    <>
      <ellipse cx="8.5" cy="8" rx="1.8" ry="2.8" transform="rotate(-30 8.5 8)" />
      <ellipse cx="15.5" cy="10" rx="1.8" ry="2.8" transform="rotate(25 15.5 10)" />
      <ellipse cx="10" cy="15.5" rx="1.8" ry="2.8" transform="rotate(15 10 15.5)" />
      <ellipse cx="16" cy="17" rx="1.5" ry="2.3" transform="rotate(-20 16 17)" />
    </>
  ),
  sulfite: (
    <>
      <path d="M10 3h4" />
      <path d="M10.5 3v5.3L6.3 16.9c-.7 1.4.3 3.1 1.9 3.1h7.6c1.6 0 2.6-1.7 1.9-3.1L13.5 8.3V3" />
      <path d="M7.8 14.4h8.4" />
      <circle cx="11" cy="17" r="1" />
      <circle cx="14" cy="17.6" r="0.7" />
    </>
  ),
  fish: (
    <>
      <path d="M2.5 12c2.6-3.6 5.9-5.4 9.8-5.4 3.9 0 7.2 1.8 9.2 5.4-2 3.6-5.3 5.4-9.2 5.4-3.9 0-7.2-1.8-9.8-5.4z" />
      <path d="M2.5 12 6 8.6M2.5 12 6 15.4" />
      <circle cx="16.5" cy="10.8" r="1" />
    </>
  ),
  celery: (
    <>
      <path d="M8 21c-.7-4.3-1-8.6-1-12.9L8.6 3" />
      <path d="M12 21c0-4.6.2-9.2.6-13.8L13 3" />
      <path d="M16 21c.7-4.3 1.2-8.5 1.6-12.7L17.4 3" />
      <path d="M6.8 8.6c3.4-1 6.9-1 10.5 0" />
    </>
  ),
  mustard: (
    <>
      <path d="M10 2.5h4v2.8l2.6 2.1c.9.7 1.4 1.8 1.4 2.9V20c0 .6-.4 1-1 1H7c-.6 0-1-.4-1-1v-9.7c0-1.1.5-2.2 1.4-2.9L10 5.3V2.5z" />
      <path d="M6 12.5h12" />
      <path d="M10.5 16h3" />
    </>
  ),
  lupin: (
    <>
      <path d="M12 21v-6.5" />
      <path d="M12 14.5c-2 0-3.6-1.6-3.6-3.6 2 0 3.6 1.6 3.6 3.6z" />
      <path d="M12 14.5c2 0 3.6-1.6 3.6-3.6-2 0-3.6 1.6-3.6 3.6z" />
      <path d="M12 10.4c-1.8 0-3.2-1.5-3.2-3.3 1.8 0 3.2 1.5 3.2 3.3z" />
      <path d="M12 10.4c1.8 0 3.2-1.5 3.2-3.3-1.8 0-3.2 1.5-3.2 3.3z" />
      <path d="M12 6.6c0-1.7.8-3.1 2.1-3.6 0 1.8-.8 3.2-2.1 3.6z" />
    </>
  ),

  // ---------- Marcas de producto ----------
  vegano: (
    <>
      <path d="M11 20c-.5-6 2.5-11.5 8.5-14.5.5 7-3 12.5-8.5 14.5z" />
      <path d="M11 20c-4-1.5-6.5-5-6.5-9 0-1 .2-2 .5-2.9" />
    </>
  ),
  imagen: (
    <>
      <rect x="3" y="4.5" width="18" height="15" rx="2" />
      <circle cx="8.5" cy="9.5" r="1.6" />
      <path d="M3 16.2l4.6-4.1c.7-.6 1.8-.6 2.5 0l3.4 3 1.9-1.6c.7-.6 1.8-.6 2.5 0L21 15.6" />
    </>
  ),
  reloj: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5.3l3.2 2" />
    </>
  ),
  info: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5" />
      <circle cx="12" cy="8" r="0.6" />
    </>
  ),
};

export default function IconoCatalogo({ nombre, tamano = 20, className }: IconoProps) {
  const trazo = (nombre && TRAZOS[nombre]) || null;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={tamano}
      height={tamano}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      {trazo ?? <circle cx="12" cy="12" r="3.2" />}
    </svg>
  );
}

/** Para que otros módulos sepan si un nombre tiene trazo propio. */
export function hayIcono(nombre: string | null | undefined): boolean {
  return Boolean(nombre && nombre in TRAZOS);
}
