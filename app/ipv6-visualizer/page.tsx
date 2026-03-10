'use client';

import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import ToolLayout from '@/components/ToolLayout';
import InputBox from '@/components/InputBox';
import OutputBox from '@/components/OutputBox';
import { analyzeIPv6, IPv6Info } from '@/lib/tools/ipv6';
import { Zap } from 'lucide-react';

const FAQS = [
    { question: 'What is :: in IPv6?', answer: ':: is a shorthand that replaces one or more consecutive groups of all-zero 16-bit blocks. It can only appear once in an address.' },
    { question: 'What is the difference between expanded and compressed?', answer: 'Expanded shows all 8 groups with leading zeros (e.g. 2001:0db8:0000:...). Compressed removes leading zeros and collapses :: runs for the shortest form.' },
    { question: 'What is a Link-Local address?', answer: 'Addresses starting with fe80::/10 are link-local — they are automatically assigned and only valid on the local network segment. They cannot be routed.' },
    { question: 'How many IPv6 addresses are there?', answer: 'IPv6 has 2^128 (approximately 3.4×10^38) addresses — enough to assign trillions of addresses to every atom on Earth.' },
];

function IPv6Inner() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [input, setInput] = useState(searchParams.get('addr') ? decodeURIComponent(searchParams.get('addr')!) : '');
    const [result, setResult] = useState<IPv6Info | null>(null);
    const [error, setError] = useState('');

    const analyze = (addr: string) => {
        if (!addr.trim()) { setResult(null); setError(''); return; }
        try {
            const r = analyzeIPv6(addr);
            setResult(r);
            setError('');
            router.replace(`/ipv6-visualizer?addr=${encodeURIComponent(addr)}`, { scroll: false });
        } catch (e) {
            setError((e as Error).message);
            setResult(null);
        }
    };

    const EXAMPLES = [
        '2001:0db8:85a3:0000:0000:8a2e:0370:7334',
        'fe80::1',
        '::1',
        '2001:db8::',
        '::ffff:192.168.1.1',
    ];

    return (
        <ToolLayout
            title="IPv6 Visualizer"
            description="Expand, compress, and decode any IPv6 address. Identify address type, prefix, and see the full group-by-group breakdown."
            badge="Network"
            faqs={FAQS}
        >
            <div className="glow-card p-5 flex flex-col gap-4">
                <InputBox
                    id="ipv6-input"
                    label="IPv6 Address"
                    value={input}
                    onChange={setInput}
                    placeholder="2001:0db8:85a3::8a2e:0370:7334"
                    example="2001:0db8:85a3:0000:0000:8a2e:0370:7334"
                    type="input"
                    monospace
                />
                <button id="analyze-btn" className="btn-primary" onClick={() => analyze(input)}>
                    <Zap size={15} /> Analyze
                </button>

                {error && (
                    <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '8px', padding: '12px', color: '#ef4444', fontSize: '0.85rem' }}>
                        ⚠️ {error}
                    </div>
                )}

                {result && (
                    <div className="fade-in flex flex-col gap-4">
                        {/* Type badge */}
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                            <span className="tag" style={{ background: 'rgba(6,182,212,0.12)', borderColor: 'rgba(6,182,212,0.3)' }}>
                                {result.type}
                            </span>
                        </div>

                        <OutputBox label="Expanded (Full)" value={result.expanded} language="ipv6" minHeight="52px" />
                        <OutputBox label="Compressed (Short)" value={result.compressed} language="ipv6" minHeight="52px" />

                        {/* Group breakdown */}
                        <div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '10px' }}>Group Breakdown (8 × 16-bit)</div>
                            <div style={{ display: 'flex', gap: '4px', overflowX: 'auto', paddingBottom: '4px' }}>
                                {result.groups.map((g, i) => (
                                    <div key={i} style={{ flex: '0 0 auto', textAlign: 'center' }}>
                                        <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginBottom: '2px' }}>G{i + 1}</div>
                                        <div style={{
                                            fontFamily: 'monospace', fontWeight: 700, fontSize: '0.85rem',
                                            color: i === 0 || i === 1 ? 'var(--accent)' : 'var(--text-primary)',
                                            background: 'var(--bg-input)', border: '1px solid var(--border)',
                                            borderRadius: '6px', padding: '6px 8px', minWidth: '52px',
                                        }}>
                                            {g}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Quick examples */}
            <div>
                <h2 className="text-lg font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>Example IPv6 Addresses</h2>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {EXAMPLES.map((ex) => (
                        <button
                            key={ex}
                            onClick={() => { setInput(ex); analyze(ex); }}
                            className="btn-ghost"
                            style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}
                        >
                            {ex}
                        </button>
                    ))}
                </div>
            </div>
        </ToolLayout>
    );
}

export default function IPv6Page() {
    return <Suspense><IPv6Inner /></Suspense>;
}
