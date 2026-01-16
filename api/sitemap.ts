import { createClient } from '@supabase/supabase-js';

export default async function handler(req: any, res: any) {
    const supabaseUrl = process.env.VITE_SUPABASE_URL ?? '';
    const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY ?? '';
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Determine protocol and host
    const protocol = req.headers['x-forwarded-proto'] || 'https';
    const host = req.headers['x-forwarded-host'] || req.headers.host;
    const baseUrl = `${protocol}://${host}`;

    // Static routes
    const staticRoutes = [
        { url: '/', changefreq: 'weekly', priority: 1.0 },
        { url: '/services', changefreq: 'monthly', priority: 0.9 },
        { url: '/portfolio', changefreq: 'monthly', priority: 0.8 },
        { url: '/blog', changefreq: 'weekly', priority: 0.8 },
        { url: '/contact', changefreq: 'monthly', priority: 0.7 },
    ];

    // Fetch blog articles
    const { data: articles } = await supabase
        .from('blog_articles')
        .select('id, updated_at, created_at');

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${staticRoutes
            .map((route) => {
                return `
  <url>
    <loc>${baseUrl}${route.url}</loc>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
  </url>`;
            })
            .join('')}
  ${(articles || [])
            .map((article) => {
                return `
  <url>
    <loc>${baseUrl}/blog/${article.id}</loc>
    <lastmod>${(article.updated_at || article.created_at || new Date().toISOString()).split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`;
            })
            .join('')}
</urlset>`;

    res.setHeader('Content-Type', 'application/xml');
    res.status(200).send(sitemap);
}
