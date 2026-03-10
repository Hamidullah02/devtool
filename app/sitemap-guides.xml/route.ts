import { NextResponse } from 'next/server';

const BASE = 'https://devnettools.com';
const now = new Date().toISOString();

function url(loc: string) {
    return `  <url>
    <loc>${BASE}${loc}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.85</priority>
  </url>`;
}

export function GET() {
    const guides = [
        '/cron-guide',
        '/regex-guide',
        '/subnet-guide',
        '/base64-guide',
        '/json-to-typescript-guide',
    ];

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${guides.map(url).join('\n')}
</urlset>`;

    return new NextResponse(xml, { headers: { 'Content-Type': 'application/xml' } });
}
