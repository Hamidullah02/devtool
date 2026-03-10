import { MetadataRoute } from 'next';
import { CRON_EXAMPLES } from '@/lib/tools/cron';
import { REGEX_EXAMPLES } from '@/lib/tools/regex';

const BASE = 'https://devnettools.com';

export default function sitemap(): MetadataRoute.Sitemap {
    const staticPages = [
        { url: BASE, lastModified: new Date(), priority: 1.0, changeFrequency: 'weekly' as const },
        { url: `${BASE}/cron`, lastModified: new Date(), priority: 0.9, changeFrequency: 'monthly' as const },
        { url: `${BASE}/json-to-typescript`, lastModified: new Date(), priority: 0.9, changeFrequency: 'monthly' as const },
        { url: `${BASE}/regex-explainer`, lastModified: new Date(), priority: 0.9, changeFrequency: 'monthly' as const },
        { url: `${BASE}/base64`, lastModified: new Date(), priority: 0.9, changeFrequency: 'monthly' as const },
        { url: `${BASE}/uuid-generator`, lastModified: new Date(), priority: 0.9, changeFrequency: 'monthly' as const },
        { url: `${BASE}/subnet-calculator`, lastModified: new Date(), priority: 0.9, changeFrequency: 'monthly' as const },
        { url: `${BASE}/ipv6-visualizer`, lastModified: new Date(), priority: 0.8, changeFrequency: 'monthly' as const },
        { url: `${BASE}/mikrotik-firewall`, lastModified: new Date(), priority: 0.8, changeFrequency: 'monthly' as const },
        { url: `${BASE}/cron-guide`, lastModified: new Date(), priority: 0.85, changeFrequency: 'monthly' as const },
        { url: `${BASE}/regex-guide`, lastModified: new Date(), priority: 0.85, changeFrequency: 'monthly' as const },
        { url: `${BASE}/subnet-guide`, lastModified: new Date(), priority: 0.85, changeFrequency: 'monthly' as const },
        { url: `${BASE}/base64-guide`, lastModified: new Date(), priority: 0.8, changeFrequency: 'monthly' as const },
        { url: `${BASE}/json-to-typescript-guide`, lastModified: new Date(), priority: 0.8, changeFrequency: 'monthly' as const },
    ];

    const cronPages = CRON_EXAMPLES.map((ex) => ({
        url: `${BASE}/cron/${ex.slug}`,
        lastModified: new Date(),
        priority: 0.7,
        changeFrequency: 'yearly' as const,
    }));

    const regexPages = REGEX_EXAMPLES.map((ex) => ({
        url: `${BASE}/regex/${ex.slug}`,
        lastModified: new Date(),
        priority: 0.7,
        changeFrequency: 'yearly' as const,
    }));

    return [...staticPages, ...cronPages, ...regexPages];
}
