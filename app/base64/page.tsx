'use client';

import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import ToolLayout from '@/components/ToolLayout';
import InputBox from '@/components/InputBox';
import OutputBox from '@/components/OutputBox';
import { base64Encode, base64Decode } from '@/lib/tools/base64';
import { Zap, ArrowLeftRight } from 'lucide-react';

const FAQS = [
    { question: 'What is Base64?', answer: 'Base64 is an encoding scheme that converts binary data into ASCII text using 64 printable characters. It is widely used in email, data URIs, and API tokens.' },
    { question: 'Is Base64 encryption?', answer: 'No. Base64 is encoding, not encryption. Anyone can decode a Base64 string without a key. Do not use it to secure sensitive data.' },
    { question: 'What is URL-safe Base64?', answer: 'Standard Base64 uses + and / which break in URLs. URL-safe Base64 replaces them with - and _ and removes trailing = padding.' },
    { question: 'Why does Base64 add = at the end?', answer: 'Base64 processes input in 3-byte chunks. Padding = characters fill incomplete chunks to maintain consistent output length.' },
];

function Base64Inner() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [input, setInput] = useState(searchParams.get('text') ? decodeURIComponent(searchParams.get('text')!) : '');
    const [output, setOutput] = useState('');
    const [urlSafe, setUrlSafe] = useState(false);
    const [error, setError] = useState('');
    const [mode, setMode] = useState<'encode' | 'decode'>('encode');

    const run = (text: string, m = mode, us = urlSafe) => {
        if (!text.trim()) { setOutput(''); setError(''); return; }
        try {
            const result = m === 'encode' ? base64Encode(text, us) : base64Decode(text, us);
            setOutput(result);
            setError('');
            router.replace(`/base64?text=${encodeURIComponent(text)}&mode=${m}`, { scroll: false });
        } catch (e) {
            setError((e as Error).message);
            setOutput('');
        }
    };

    const swap = () => {
        const newMode = mode === 'encode' ? 'decode' : 'encode';
        setMode(newMode);
        setInput(output);
        setOutput('');
        if (output) run(output, newMode, urlSafe);
    };

    return (
        <ToolLayout
            title="Base64 Encoder / Decoder"
            description="Instantly encode text to Base64 or decode Base64 strings back to plain text. Supports standard and URL-safe variants."
            badge="Developer"
            guideHref="/base64-guide"
            faqs={FAQS}
        >
            <div className="glow-card p-5 flex flex-col gap-4">
                {/* Mode toggle */}
                <div className="flex gap-2 items-center flex-wrap">
                    {(['encode', 'decode'] as const).map((m) => (
                        <button key={m} onClick={() => { setMode(m); setOutput(''); }} className={mode === m ? 'btn-primary' : 'btn-secondary'} style={{ padding: '6px 16px', fontSize: '0.82rem' }}>
                            {m.charAt(0).toUpperCase() + m.slice(1)}
                        </button>
                    ))}
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: 'var(--text-secondary)', cursor: 'pointer', marginLeft: '8px' }}>
                        <input type="checkbox" checked={urlSafe} onChange={(e) => { setUrlSafe(e.target.checked); if (output) run(input, mode, e.target.checked); }} />
                        URL-safe
                    </label>
                </div>

                <InputBox
                    id="base64-input"
                    label={mode === 'encode' ? 'Plain Text' : 'Base64 String'}
                    value={input}
                    onChange={(v) => setInput(v)}
                    placeholder={mode === 'encode' ? 'Enter text to encode...' : 'Paste Base64 string to decode...'}
                    example={mode === 'encode' ? 'Hello, World! This is a test string.' : 'SGVsbG8sIFdvcmxkISBUaGlzIGlzIGEgdGVzdCBzdHJpbmcu'}
                    rows={5}
                    monospace={mode === 'decode'}
                />

                <div className="flex gap-3 flex-wrap">
                    <button id="run-btn" className="btn-primary" onClick={() => run(input)}>
                        <Zap size={15} /> {mode === 'encode' ? 'Encode' : 'Decode'}
                    </button>
                    <button className="btn-secondary" onClick={swap} title="Swap input/output and flip mode">
                        <ArrowLeftRight size={15} /> Swap
                    </button>
                    <button className="btn-secondary" onClick={() => { setInput(''); setOutput(''); setError(''); }}>Clear</button>
                </div>

                {error && (
                    <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '8px', padding: '12px', color: '#ef4444', fontSize: '0.85rem' }}>
                        ⚠️ {error}
                    </div>
                )}

                <OutputBox
                    label={mode === 'encode' ? 'Base64 Output' : 'Decoded Text'}
                    value={output}
                    language={mode === 'encode' ? 'base64' : 'text'}
                    minHeight="120px"
                />
            </div>
        </ToolLayout>
    );
}

export default function Base64Page() {
    return <Suspense><Base64Inner /></Suspense>;
}
