import { NextResponse } from 'next/server';
import { JSON_EXAMPLES } from '@/lib/tools/json-to-ts';

const BASE = 'https://devnettools.com';
const now = new Date().toISOString();

export function GET() {
    const urls = JSON_EXAMPLES.map((ex) => `  <url>
    <loc>${BASE}/json-to-typescript/${ex.slug}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`);

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`;

    return new NextResponse(xml, { headers: { 'Content-Type': 'application/xml' } });
}
