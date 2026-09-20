/**
 * Migas de pan del catálogo.
 *
 * Emiten también JSON-LD `BreadcrumbList`: con tres niveles de URL, ayuda a
 * que el buscador entienda la jerarquía y la muestre en los resultados.
 */

import Link from 'next/link';

export interface Miga {
  nombre: string;
  /** El último nivel va sin href: es la página actual. */
  href?: string;
}

const BASE = 'https://lasorianita.es';

export default function Migas({ items }: { items: Miga[] }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.nombre,
      ...(item.href ? { item: `${BASE}${item.href}` } : {}),
    })),
  };

  return (
    <>
      <nav aria-label="Migas de pan" className="text-xs text-stone-500">
        <ol className="flex flex-wrap items-center gap-1.5">
          {items.map((item, i) => (
            <li key={`${item.nombre}-${i}`} className="flex items-center gap-1.5">
              {item.href ? (
                <Link href={item.href} className="transition-colors hover:text-soria-red">
                  {item.nombre}
                </Link>
              ) : (
                <span className="text-stone-700" aria-current="page">
                  {item.nombre}
                </span>
              )}
              {i < items.length - 1 && (
                <span aria-hidden="true" className="text-stone-300">
                  /
                </span>
              )}
            </li>
          ))}
        </ol>
      </nav>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
