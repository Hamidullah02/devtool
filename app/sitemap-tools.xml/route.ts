import { NextResponse } from 'next/server';

const BASE = 'https://devnettools.com';
const now = new Date().toISOString();

function url(loc: string, priority: string, freq: string) {
    return `  <url>
    <loc>${BASE}${loc}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${freq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

export function GET() {
    const urls = [
        url('/', '1.0', 'weekly'),
        url('/cron', '0.9', 'monthly'),
        url('/json-to-typescript', '0.9', 'monthly'),
        url('/regex-explainer', '0.9', 'monthly'),
        url('/base64', '0.9', 'monthly'),
        url('/uuid-generator', '0.9', 'monthly'),
        url('/subnet-calculator', '0.9', 'monthly'),
        url('/ipv6-visualizer', '0.8', 'monthly'),
        url('/mikrotik-firewall', '0.9', 'monthly'),
    ];

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`;

    return new NextResponse(xml, { headers: { 'Content-Type': 'application/xml' } });
}
