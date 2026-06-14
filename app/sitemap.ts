import type { MetadataRoute } from "next";
import { getPosts, getSystems, getTools } from "@/lib/data";
import { getSiteUrl } from "@/lib/site-url";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, systems, tools] = await Promise.all([getPosts(), getSystems(), getTools()]);
  const siteUrl = getSiteUrl();
  const now = new Date();

  return [
    { url: siteUrl, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${siteUrl}/herramientas`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${siteUrl}/sistemas`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${siteUrl}/descargas`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${siteUrl}/blog`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${siteUrl}/acerca-de`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${siteUrl}/contacto`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    ...posts.map((post) => ({
      url: `${siteUrl}/blog/${post.slug}`,
      lastModified: new Date(post.created_at),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...systems.map((system) => ({
      url: `${siteUrl}/sistemas/${system.slug}`,
      lastModified: new Date(system.created_at),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...tools.map((tool) => ({
      url: `${siteUrl}/herramientas/${tool.slug}`,
      lastModified: new Date(tool.created_at),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
