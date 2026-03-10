import { NextResponse } from 'next/server';
import { MIKROTIK_RULES } from '@/lib/tools/mikrotik';

const BASE = 'https://devnettools.com';
const now = new Date().toISOString();

export function GET() {
    const urls = MIKROTIK_RULES.map((r) => `  <url>
    <loc>${BASE}/mikrotik-firewall/${r.slug}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.75</priority>
  </url>`);

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`;

    return new NextResponse(xml, { headers: { 'Content-Type': 'application/xml' } });
}
