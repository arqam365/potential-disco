import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: '*',
                allow: ['/destination/*', '/destination/*/package/*', '/'],
                disallow: ['/api/', '/admin/'],
            }
        ],
        sitemap: 'https://packagefy.com/sitemap.xml',
    }
}
