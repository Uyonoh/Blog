import { MetadataRoute } from 'next';
import { getAllPostSlugs } from '@/lib/data';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const domainUrl = 'https://uyonoh.com/';
  const baseUrl = 'https://blog.uyonoh.com/';
  
  // Fetch all post slugs
  const slugs = await getAllPostSlugs();
  
  const postEntries = slugs.map((slug) => ({
    url: `${baseUrl}post/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [
    {
      url: domainUrl,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    ...postEntries,
  ];
}
