import { buildToolMeta } from '@/lib/metadata';
import ToolLayout from '@/components/ToolLayout';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = buildToolMeta({
    title: 'JSON to TypeScript Guide — Convert JSON to Interfaces',
    description: 'Learn how to convert JSON objects to TypeScript interfaces manually and automatically. Understand type inference, nested types, and optional fields.',
    slug: 'json-to-typescript-guide',
    keywords: ['json to typescript guide', 'json to interface', 'typescript interface from json', 'json types typescript'],
});

export default function JsonToTsGuidePage() {
    const faqs = [
        { question: 'When should I convert JSON to TypeScript?', answer: 'Whenever you receive JSON from an API and want type safety. Converting to an interface lets TypeScript catch property name typos and type mismatches at compile time.' },
        { question: 'What is the difference between type and interface?', answer: 'Both work for JSON shapes. `interface` is extendable and preferred for object types. `type` is more flexible (unions, intersections). Use `interface` for data models.' },
        { question: 'How do I handle optional fields?', answer: 'Mark fields that may be absent with ?: (e.g., `name?: string`). This is common for API responses that omit null or missing fields.' },
        { question: 'What about deeply nested JSON?', answer: 'The converter recursively generates interfaces for nested objects. Each nested object level produces a distinct inline type block.' },
    ];

    return (
        <ToolLayout
            title="JSON to TypeScript Interface Guide"
            description="Learn how to transform JSON data into strongly-typed TypeScript interfaces, manually and with our free tool."
            badge="Guide"
            faqs={faqs}
        >
            <div className="glow-card p-5 flex flex-col gap-4">
                <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>Manual Conversion Example</h2>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>JSON Input</div>
                        <div className="output-block" style={{ fontSize: '0.82rem', color: '#93c5fd' }}>
                            {`{
  "id": 1,
  "name": "Alice",
  "active": true,
  "tags": ["admin"]
}`}
                        </div>
                    </div>
                    <div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>TypeScript Output</div>
                        <div className="output-block" style={{ fontSize: '0.82rem', color: '#a5f3fc' }}>
                            {`interface Root {
  id: number;
  name: string;
  active: boolean;
  tags: string[];
}`}
                        </div>
                    </div>
                </div>
            </div>

            <div className="glow-card p-5 flex flex-col gap-3">
                <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>Type Mapping Rules</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '10px' }}>
                    {[
                        { json: '"string"', ts: 'string' },
                        { json: '42', ts: 'number' },
                        { json: 'true/false', ts: 'boolean' },
                        { json: 'null', ts: 'null' },
                        { json: '[]', ts: 'unknown[]' },
                        { json: '[{}]', ts: 'Object[]' },
                        { json: '{}', ts: 'nested interface' },
                    ].map((m) => (
                        <div key={m.json} style={{ display: 'flex', gap: '8px', alignItems: 'center', padding: '8px', background: 'var(--bg-input)', borderRadius: '6px', border: '1px solid var(--border)' }}>
                            <code style={{ fontFamily: 'monospace', color: '#93c5fd', fontSize: '0.82rem', flex: 1 }}>{m.json}</code>
                            <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>→</span>
                            <code style={{ fontFamily: 'monospace', color: 'var(--accent)', fontSize: '0.82rem', flex: 1 }}>{m.ts}</code>
                        </div>
                    ))}
                </div>
            </div>

            <div className="glow-card p-5 text-center" style={{ background: 'linear-gradient(135deg, rgba(6,182,212,0.08), rgba(59,130,246,0.05))' }}>
                <h3 className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>Auto-convert any JSON instantly</h3>
                <Link href="/json-to-typescript" className="btn-primary">Open JSON Converter →</Link>
            </div>
        </ToolLayout>
    );
}
