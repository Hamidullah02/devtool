'use client';

import { useState, useCallback, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import ToolLayout from '@/components/ToolLayout';
import InputBox from '@/components/InputBox';
import OutputBox from '@/components/OutputBox';
import ExampleCard from '@/components/ExampleCard';
import { jsonToTypeScript } from '@/lib/tools/json-to-ts';
import { Code2, Zap } from 'lucide-react';

const EXAMPLE_JSON = `{
  "id": 1,
  "name": "Alice Johnson",
  "email": "alice@example.com",
  "role": "admin",
  "active": true,
  "score": 98.5,
  "tags": ["developer", "team-lead"],
  "address": {
    "city": "New York",
    "zip": "10001"
  }
}`;

const EXAMPLES = [
    { title: 'User object', json: EXAMPLE_JSON },
    { title: 'API response', json: '{"data": [{"id": 1, "value": "foo"}], "total": 1, "page": 1}' },
    { title: 'Config file', json: '{"debug": false, "port": 3000, "db": {"host": "localhost", "name": "mydb"}}' },
];

const FAQS = [
    { question: 'Does this handle nested objects?', answer: 'Yes. Nested objects are recursively converted into named interfaces. Each nested object produces a distinct inline type.' },
    { question: 'What happens with arrays?', answer: 'Arrays are typed as `ElementType[]`. If the array contains objects, the object shape is inlined. Empty arrays become `unknown[]`.' },
    { question: 'Is my data sent to a server?', answer: 'No. All conversion happens in your browser using JavaScript. Nothing is uploaded.' },
    { question: 'How do I handle optional fields?', answer: 'Currently all fields are required. To mark a field optional, add `?` before the colon in the generated interface.' },
];

function JsonToTsInner() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [input, setInput] = useState(searchParams.get('json') ? decodeURIComponent(searchParams.get('json')!) : '');
    const [output, setOutput] = useState('');
    const [error, setError] = useState('');

    const convert = useCallback((json: string) => {
        if (!json.trim()) { setOutput(''); setError(''); return; }
        try {
            const result = jsonToTypeScript(json);
            setOutput(result);
            setError('');
            router.replace(`/json-to-typescript?json=${encodeURIComponent(json)}`, { scroll: false });
        } catch (e) {
            setError((e as Error).message);
            setOutput('');
        }
    }, [router]);

    useEffect(() => {
        const preloaded = searchParams.get('json');
        if (preloaded) convert(decodeURIComponent(preloaded));
    }, []);

    return (
        <ToolLayout
            title="JSON to TypeScript Converter"
            description="Paste any JSON object and instantly generate TypeScript interfaces. Supports nested objects, arrays, and all primitive types."
            badge="Developer"
            guideHref="/json-to-typescript-guide"
            faqs={FAQS}
        >
            {/* Tool UI */}
            <div className="glow-card p-5 flex flex-col gap-4">
                <InputBox
                    id="json-input"
                    label="JSON Input"
                    value={input}
                    onChange={(v) => setInput(v)}
                    placeholder='Paste your JSON here: {"key": "value"}'
                    example={EXAMPLE_JSON}
                    monospace
                    rows={10}
                />

                <div className="flex gap-3 flex-wrap">
                    <button id="convert-btn" className="btn-primary" onClick={() => convert(input)}>
                        <Zap size={15} /> Convert to TypeScript
                    </button>
                    <button className="btn-secondary" onClick={() => { setInput(''); setOutput(''); setError(''); }}>
                        Clear
                    </button>
                </div>

                {error && (
                    <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '8px', padding: '12px', color: '#ef4444', fontSize: '0.85rem' }}>
                        ⚠️ {error}
                    </div>
                )}

                <OutputBox label="TypeScript Output" value={output} language="typescript" minHeight="200px" />
            </div>

            {/* Examples */}
            <div>
                <h2 className="text-lg font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
                    Example JSON structures
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1rem' }}>
                    {EXAMPLES.map((ex) => (
                        <ExampleCard
                            key={ex.title}
                            title={ex.title}
                            expression={ex.json}
                            language="json"
                            toolHref={`/json-to-typescript?json=${encodeURIComponent(ex.json)}`}
                        />
                    ))}
                </div>
            </div>
        </ToolLayout>
    );
}

export default function JsonToTypescriptPage() {
    return (
        <Suspense>
            <JsonToTsInner />
        </Suspense>
    );
}
