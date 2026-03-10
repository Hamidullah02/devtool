import { JSON_EXAMPLES, jsonToTypeScript } from '@/lib/tools/json-to-ts';
import { buildToolMeta, buildHowToSchema } from '@/lib/metadata';
import ToolLayout from '@/components/ToolLayout';
import OutputBox from '@/components/OutputBox';
import Link from 'next/link';
import type { Metadata } from 'next';

export async function generateStaticParams() {
    return JSON_EXAMPLES.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const example = JSON_EXAMPLES.find((e) => e.slug === slug);
    if (!example) return { title: 'JSON to TypeScript | DevNet Tools' };

    return buildToolMeta({
        title: `JSON to TypeScript: ${example.title} Interface`,
        description: `Convert a ${example.title} JSON structure to a TypeScript interface. ${example.description}`,
        slug: `json-to-typescript/${slug}`,
        keywords: ['json to typescript', 'typescript interface', example.title.toLowerCase(), 'json converter', 'type generation'],
    });
}

export default async function JsonSlugPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const example = JSON_EXAMPLES.find((e) => e.slug === slug);

    if (!example) {
        return (
            <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                <p>Example not found. <Link href="/json-to-typescript">Back to JSON to TypeScript →</Link></p>
            </div>
        );
    }

    let tsOutput = '';
    try {
        tsOutput = jsonToTypeScript(example.json);
    } catch {
        tsOutput = '// Could not generate TypeScript for this example';
    }

    const schemas = [
        buildHowToSchema(`Convert ${example.title} JSON to TypeScript`, [
            `Open the JSON to TypeScript converter tool`,
            `The JSON for "${example.title}" is pre-loaded`,
            `Click "Convert to TypeScript" to generate the interface`,
            `Copy the generated TypeScript interface`,
            `Paste into your .ts or .d.ts file`,
        ]),
    ];

    const otherExamples = JSON_EXAMPLES.filter((e) => e.slug !== slug).slice(0, 6);

    return (
        <ToolLayout
            title={`TypeScript Interface: ${example.title}`}
            description={example.description}
            badge="Developer"
            guideHref="/json-to-typescript-guide"
            schemaJsonLd={schemas}
            faqs={[
                { question: `What TypeScript interface does a ${example.title} generate?`, answer: `The converter produces a fully-typed TypeScript interface with correct types for all fields including nested objects and arrays.` },
                { question: 'Are nested objects handled?', answer: 'Yes. Each nested object becomes an inline type within the parent interface, fully recursively.' },
                { question: 'Is my JSON sent anywhere?', answer: 'No. All conversion happens in your browser using JavaScript. Nothing is uploaded to any server.' },
                { question: 'How do I make fields optional?', answer: 'After generating, add ? before the colon for any field you want optional. For example: name?: string;' },
            ]}
        >
            {/* Input JSON */}
            <div className="glow-card p-5 flex flex-col gap-4">
                <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>Input JSON</div>
                    <OutputBox value={example.json} language="json" minHeight="180px" />
                </div>
            </div>

            {/* Generated TypeScript */}
            <div className="glow-card p-5 flex flex-col gap-4">
                <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--accent)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>Generated TypeScript Interface</div>
                    <OutputBox value={tsOutput} language="typescript" minHeight="180px" />
                </div>
                <Link href={`/json-to-typescript?json=${encodeURIComponent(example.json)}`} className="btn-primary" style={{ width: 'fit-content' }}>
                    Edit in Tool →
                </Link>
            </div>

            {/* How to use */}
            <div className="glow-card p-5 flex flex-col gap-3">
                <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>How to Use This Interface</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {[
                        'Copy the generated interface above',
                        'Create a new .ts file or add to an existing types file (e.g. types.ts)',
                        'Paste the interface and rename Root to something meaningful (e.g. UserProfile)',
                        'Import and use the type: import type { UserProfile } from "./types"',
                        'For API calls: const data: UserProfile = await response.json()',
                    ].map((step, i) => (
                        <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                            <div style={{ background: 'rgba(6,182,212,0.12)', border: '1px solid rgba(6,182,212,0.3)', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 700, color: 'var(--accent)', flexShrink: 0 }}>{i + 1}</div>
                            <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6, paddingTop: '3px' }}>{step}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Other examples */}
            {otherExamples.length > 0 && (
                <div>
                    <h2 className="text-lg font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>More JSON Examples</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem' }}>
                        {otherExamples.map((ex) => (
                            <Link key={ex.slug} href={`/json-to-typescript/${ex.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                <div className="glow-card p-4 flex flex-col gap-2" style={{ height: '100%' }}>
                                    <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)' }}>{ex.title}</div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{ex.description}</div>
                                    <div style={{ marginTop: 'auto', fontSize: '0.75rem', color: 'var(--accent)' }}>View interface →</div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </ToolLayout>
    );
}
