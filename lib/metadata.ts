import { Metadata } from 'next';

interface ToolMetaOptions {
    title: string;
    description: string;
    slug: string;
    keywords?: string[];
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://devnettools.com';
const SITE_NAME = 'DevNet Tools';

export function buildToolMeta({ title, description, slug, keywords = [] }: ToolMetaOptions): Metadata {
    const fullTitle = `${title} | ${SITE_NAME}`;
    const url = `${SITE_URL}/${slug}`;

    return {
        title: fullTitle,
        description,
        keywords: ['developer tools', 'devtools', 'online tools', ...keywords],
        openGraph: {
            title: fullTitle,
            description,
            url,
            siteName: SITE_NAME,
            type: 'website',
            images: [{ url: `${SITE_URL}/og/${slug}.png`, width: 1200, height: 630 }],
        },
        twitter: {
            card: 'summary_large_image',
            title: fullTitle,
            description,
        },
        alternates: { canonical: url },
        robots: { index: true, follow: true },
    };
}

export function buildSoftwareAppSchema(name: string, description: string, url: string) {
    return {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name,
        description,
        url,
        applicationCategory: 'DeveloperApplication',
        operatingSystem: 'Any',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        author: { '@type': 'Organization', name: SITE_NAME },
    };
}

export function buildFAQSchema(faqs: { question: string; answer: string }[]) {
    return {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs.map((faq) => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: { '@type': 'Answer', text: faq.answer },
        })),
    };
}

export function buildHowToSchema(name: string, steps: string[]) {
    return {
        '@context': 'https://schema.org',
        '@type': 'HowTo',
        name,
        step: steps.map((text, i) => ({
            '@type': 'HowToStep',
            position: i + 1,
            text,
        })),
    };
}
