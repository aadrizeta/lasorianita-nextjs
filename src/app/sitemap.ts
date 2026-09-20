import type { MetadataRoute } from "next";
import { getCategorias, getProductos } from "@/lib/catalogo";

const baseUrl = "https://lasorianita.es";

/**
 * El catálogo aporta ahora una URL por categoría y otra por producto, así que
 * el sitemap se genera a partir del CMS en lugar de listarlas a mano.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [categorias, productos] = await Promise.all([getCategorias(), getProductos()]);

  const estaticas: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${baseUrl}/catalogo`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/encuentranos`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/trabaja-con-nosotros`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/politica-de-privacidad`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  const deCategorias: MetadataRoute.Sitemap = categorias.map((categoria) => ({
    url: `${baseUrl}/catalogo/${categoria.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  // Ahora que el CMS expone date_created/date_updated, cada ficha declara su
  // fecha real en vez de fingir que todas cambiaron hoy.
  const deProductos: MetadataRoute.Sitemap = productos.map((producto) => ({
    url: `${baseUrl}/catalogo/${producto.categoria}/${producto.slug}`,
    lastModified: new Date(producto.date_updated ?? producto.date_created ?? Date.now()),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...estaticas, ...deCategorias, ...deProductos];
}
