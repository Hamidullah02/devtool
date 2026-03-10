'use client';

import { useState } from 'react';
import ToolLayout from '@/components/ToolLayout';
import OutputBox from '@/components/OutputBox';
import { generateBatch, isValidUUID } from '@/lib/tools/uuid';
import { Shuffle, CheckCircle, XCircle } from 'lucide-react';

const FAQS = [
    { question: 'What is UUID v4?', answer: 'UUID v4 is a randomly generated 128-bit identifier in the format xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx. The "4" indicates version 4 (random), and "y" is one of 8, 9, a, or b.' },
    { question: 'Are UUIDs truly unique?', answer: 'Practically yes. The probability of generating two identical v4 UUIDs is astronomically low (1 in 5.3×10³⁶). You can safely use them as primary keys.' },
    { question: 'Can I use this for database primary keys?', answer: 'Yes. UUIDs are widely used as primary keys in distributed systems because they can be generated client-side without a central counter.' },
    { question: 'Is this cryptographically secure?', answer: 'This tool uses Web Crypto API (crypto.randomUUID) which is cryptographically secure and available in all modern browsers.' },
];

export default function UuidPage() {
    const [count, setCount] = useState(1);
    const [uuids, setUuids] = useState<string[]>([]);
    const [validateInput, setValidateInput] = useState('');
    const [validResult, setValidResult] = useState<boolean | null>(null);

    const generate = () => {
        setUuids(generateBatch(Math.min(Math.max(1, count), 100)));
    };

    const validate = (v: string) => {
        setValidateInput(v);
        if (v.trim()) setValidResult(isValidUUID(v.trim()));
        else setValidResult(null);
    };

    return (
        <ToolLayout
            title="UUID v4 Generator"
            description="Generate RFC 4122 v4 UUIDs in bulk using your browser's cryptographically secure random number generator."
            badge="Developer"
            faqs={FAQS}
        >
            {/* Generator */}
            <div className="glow-card p-5 flex flex-col gap-4">
                <div className="flex items-end gap-3 flex-wrap">
                    <div>
                        <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                            How many? (1–100)
                        </label>
                        <input
                            id="uuid-count"
                            type="number"
                            min={1} max={100}
                            value={count}
                            onChange={(e) => setCount(parseInt(e.target.value) || 1)}
                            className="input-field"
                            style={{ width: '120px' }}
                        />
                    </div>
                    <button id="generate-btn" className="btn-primary" onClick={generate}>
                        <Shuffle size={15} /> Generate
                    </button>
                </div>

                <OutputBox
                    label={`Generated UUIDs (${uuids.length})`}
                    value={uuids.join('\n')}
                    minHeight="160px"
                    placeholder="Click Generate to create UUIDs..."
                />
            </div>

            {/* Validator */}
            <div className="glow-card p-5 flex flex-col gap-3">
                <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>UUID Validator</h3>
                <div className="flex gap-3 items-center flex-wrap">
                    <input
                        id="uuid-validate"
                        className="input-field"
                        style={{ fontFamily: 'monospace', flex: 1, minWidth: '260px' }}
                        placeholder="Paste a UUID to validate..."
                        value={validateInput}
                        onChange={(e) => validate(e.target.value)}
                    />
                    {validResult !== null && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem', color: validResult ? 'var(--green)' : '#ef4444', whiteSpace: 'nowrap' }}>
                            {validResult ? <CheckCircle size={16} /> : <XCircle size={16} />}
                            {validResult ? 'Valid UUID v4' : 'Invalid UUID'}
                        </div>
                    )}
                </div>
            </div>

            {/* Info cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
                {[
                    { label: 'Version', value: 'v4 (random)' },
                    { label: 'Bits', value: '128-bit' },
                    { label: 'Format', value: '8-4-4-4-12 hex' },
                    { label: 'Uniqueness', value: '5.3×10³⁶ combinations' },
                ].map((stat) => (
                    <div key={stat.label} className="glow-card p-4 text-center">
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>{stat.label}</div>
                        <div style={{ fontWeight: 700, color: 'var(--accent)', fontFamily: 'monospace' }}>{stat.value}</div>
                    </div>
                ))}
            </div>
        </ToolLayout>
    );
}
