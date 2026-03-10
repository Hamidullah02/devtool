import { NextResponse } from 'next/server';

const BASE = 'https://devnettools.com';

// Sitemap index — points to 6 sub-sitemaps each covering a topic
export function GET() {
    const now = new Date().toISOString();
    const sitemaps = [
        'sitemap-tools',
        'sitemap-guides',
        'sitemap-cron',
        'sitemap-regex',
        'sitemap-mikrotik',
        'sitemap-json',
    ];

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemaps.map((s) => `  <sitemap>
    <loc>${BASE}/${s}.xml</loc>
    <lastmod>${now}</lastmod>
  </sitemap>`).join('\n')}
</sitemapindex>`;

    return new NextResponse(xml, {
        headers: { 'Content-Type': 'application/xml' },
    });
}
