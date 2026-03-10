import { REGEX_EXAMPLES, tokenizeRegex } from '@/lib/tools/regex';
import { buildToolMeta, buildHowToSchema, buildFAQSchema } from '@/lib/metadata';
import ToolLayout from '@/components/ToolLayout';
import OutputBox from '@/components/OutputBox';
import Link from 'next/link';
import type { Metadata } from 'next';

export async function generateStaticParams() {
    return REGEX_EXAMPLES.map((ex) => ({ slug: ex.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const example = REGEX_EXAMPLES.find((e) => e.slug === slug);
    if (!example) return { title: 'Regex Pattern | DevNet Tools' };

    return buildToolMeta({
        title: `${example.title} Regex Pattern — Explained`,
        description: `${example.description}. Pattern: ${example.pattern}. Copy-ready with full token-by-token explanation and test examples.`,
        slug: `regex/${slug}`,
        keywords: ['regex', example.title.toLowerCase(), 'regular expression', 'pattern', slug.replace(/-/g, ' ')],
    });
}

export default async function RegexSlugPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const example = REGEX_EXAMPLES.find((e) => e.slug === slug);

    if (!example) {
        return (
            <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                <p>Pattern not found. <Link href="/regex-explainer">Back to Regex Explainer →</Link></p>
            </div>
        );
    }

    const tokens = tokenizeRegex(example.pattern);

    const schemas = [
        buildHowToSchema(`Use the ${example.title} regex pattern`, [
            `Copy the pattern: ${example.pattern}`,
            'Paste it into your code or test tool',
            `Apply it to input: ${example.description}`,
        ]),
        buildFAQSchema([
            { question: `What does the ${example.title} regex do?`, answer: example.description },
            { question: 'Is this pattern case-sensitive?', answer: 'Yes, by default. Add the /i flag to make it case-insensitive.' },
        ]),
    ];

    return (
        <ToolLayout
            title={`${example.title} — Regex Pattern`}
            description={`${example.description}. Full token-by-token explanation of the regex, copy-ready pattern, and usage examples.`}
            badge="Regex Pattern"
            guideHref="/regex-guide"
            schemaJsonLd={schemas}
            faqs={[
                { question: `What does this regex match?`, answer: example.description },
                { question: 'How do I use this in JavaScript?', answer: `const regex = /${example.pattern}/; const isMatch = regex.test(input);` },
                { question: 'How do I make it case-insensitive?', answer: `Add the i flag: /${example.pattern}/i` },
            ]}
        >
            <div className="glow-card p-5 flex flex-col gap-4">
                <OutputBox label="Pattern" value={example.pattern} language="regex" minHeight="52px" />

                {/* Token breakdown */}
                <div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '10px' }}>{tokens.length} tokens</div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '8px' }}>
                        {tokens.map((token, i) => (
                            <div key={i} style={{ background: 'var(--bg-input)', border: `1px solid ${token.color}40`, borderRadius: '8px', padding: '8px 10px', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                                <code style={{ color: token.color, fontFamily: 'monospace', fontWeight: 700 }}>{token.raw}</code>
                                <span style={{ fontSize: '0.7rem', color: token.color, opacity: 0.8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{token.type}</span>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{token.description}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex gap-2 flex-wrap">
                    <Link href={`/regex-explainer?pattern=${encodeURIComponent(example.pattern)}`} className="btn-primary">
                        Open in Regex Explainer
                    </Link>
                    <Link href="/regex-guide" className="btn-secondary">Regex Guide</Link>
                </div>
            </div>

            <div>
                <h2 className="text-lg font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>Other Regex Patterns</h2>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {REGEX_EXAMPLES.filter((e) => e.slug !== slug).map((e) => (
                        <Link key={e.slug} href={`/regex/${e.slug}`} className="btn-ghost" style={{ fontSize: '0.8rem' }}>
                            {e.title}
                        </Link>
                    ))}
                </div>
            </div>
        </ToolLayout>
    );
}
