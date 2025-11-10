import { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://yourwebsite.com';

  // Fetch all swords
  const swords = await prisma.sword.findMany({
    select: {
      id: true,
      updatedAt: true,
    },
  });

  // Static routes
  const routes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/swords`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/craftsmanship`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ] as MetadataRoute.Sitemap;

  // Dynamic sword routes
  const swordRoutes = swords.map((sword: { id: string; updatedAt: Date }) => ({
    url: `${baseUrl}/swords/${sword.id}`,
    lastModified: sword.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return [...routes, ...swordRoutes];
}