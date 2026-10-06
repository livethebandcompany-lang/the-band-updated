import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_APP_URL || 'https://www.thebandcompany.in';
  
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/admin',
        '/admin/*',
        '/api',
        '/api/*',
        '/auth',
        '/auth/*',
        '/invoice',
        '/invoice/*',
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
