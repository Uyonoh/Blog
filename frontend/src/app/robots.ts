import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/admin/', '/post/create/'],
    },
    sitemap: 'https://blog.uyonoh.com/sitemap.xml',
  };
}
