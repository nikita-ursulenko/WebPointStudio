export default function handler(req: any, res: any) {
    const protocol = req.headers['x-forwarded-proto'] || 'https';
    const host = req.headers['x-forwarded-host'] || req.headers.host;
    const baseUrl = `${protocol}://${host}`;

    const robots = `User-agent: *
Allow: /

# Sitemap
Sitemap: ${baseUrl}/sitemap.xml
`;

    res.setHeader('Content-Type', 'text/plain');
    res.status(200).send(robots);
}
