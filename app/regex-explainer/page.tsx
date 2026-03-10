'use client';

import { useState, useCallback, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import ToolLayout from '@/components/ToolLayout';
import InputBox from '@/components/InputBox';
import ExampleCard from '@/components/ExampleCard';
import { tokenizeRegex, REGEX_EXAMPLES, RegexToken } from '@/lib/tools/regex';
import { Zap } from 'lucide-react';
import Link from 'next/link';

const FAQS = [
    { question: 'What is a regex?', answer: 'A regular expression (regex) is a pattern used to match text. It is widely used in programming for validation, search-and-replace, and data extraction.' },
    { question: 'What do the colors mean?', answer: 'Each color represents a different token type: yellow = anchors, purple = groups, green = quantifiers, blue = character classes, red = special chars, gray = literals.' },
    { question: 'Does this support all regex flavors?', answer: 'This tool targets JavaScript (ECMAScript) regex syntax, which works in most modern languages with minor differences.' },
    { question: 'What is a capturing group?', answer: 'A capturing group (parentheses) remembers the match. Non-capturing groups (?:...) match without storing. You can reference capturing groups with $1, $2 in replacements.' },
];

function TokenBadge({ token }: { token: RegexToken }) {
    return (
        <div
            style={{
                background: 'var(--bg-card)',
                border: `1px solid ${token.color}40`,
                borderRadius: '8px',
                padding: '10px 12px',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
            }}
        >
            <code style={{ color: token.color, fontFamily: 'monospace', fontSize: '1rem', fontWeight: 700 }}>{token.raw}</code>
            <span style={{ fontSize: '0.72rem', color: token.color, opacity: 0.8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{token.type}</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{token.description}</span>
        </div>
    );
}

function RegexInner() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [pattern, setPattern] = useState(searchParams.get('pattern') ? decodeURIComponent(searchParams.get('pattern')!) : '');
    const [tokens, setTokens] = useState<RegexToken[]>([]);
    const [testStr, setTestStr] = useState('');
    const [testResult, setTestResult] = useState<string | null>(null);
    const [error, setError] = useState('');

    const analyze = useCallback((p: string) => {
        if (!p.trim()) { setTokens([]); setError(''); return; }
        try {
            const t = tokenizeRegex(p);
            setTokens(t);
            setError('');
            router.replace(`/regex-explainer?pattern=${encodeURIComponent(p)}`, { scroll: false });
        } catch (e) {
            setError((e as Error).message);
            setTokens([]);
        }
    }, [router]);

    const testRegex = useCallback(() => {
        try {
            const clean = pattern.replace(/^\/|\/[gimsuy]*$/g, '');
            const flags = pattern.match(/\/([gimsuy]*)$/)?.[1] || 'g';
            const re = new RegExp(clean, flags);
            const matches = testStr.match(re);
            setTestResult(matches ? `✅ ${matches.length} match(es): ${matches.join(', ')}` : '❌ No match found.');
        } catch {
            setTestResult('⚠️ Invalid regex — cannot test.');
        }
    }, [pattern, testStr]);

    useEffect(() => {
        const p = searchParams.get('pattern');
        if (p) analyze(decodeURIComponent(p));
    }, []);

    return (
        <ToolLayout
            title="Regex Explainer"
            description="Paste any regular expression and get a token-by-token breakdown in plain English. Works with JavaScript / Python / PHP regex syntax."
            badge="Developer"
            guideHref="/regex-guide"
            faqs={FAQS}
        >
            <div className="glow-card p-5 flex flex-col gap-4">
                <InputBox
                    id="regex-input"
                    label="Regex Pattern"
                    value={pattern}
                    onChange={(v) => setPattern(v)}
                    placeholder="^[\w.-]+@[\w.-]+\.[a-zA-Z]{2,}$"
                    example={REGEX_EXAMPLES[0].pattern}
                    monospace
                    type="input"
                />
                <button id="analyze-btn" className="btn-primary" onClick={() => analyze(pattern)}>
                    <Zap size={15} /> Explain Regex
                </button>

                {error && (
                    <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '8px', padding: '12px', color: '#ef4444', fontSize: '0.85rem' }}>
                        ⚠️ {error}
                    </div>
                )}

                {tokens.length > 0 && (
                    <div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>{tokens.length} tokens found</div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '10px' }}>
                            {tokens.map((token, i) => <TokenBadge key={i} token={token} />)}
                        </div>
                    </div>
                )}
            </div>

            {/* Regex tester */}
            {tokens.length > 0 && (
                <div className="glow-card p-5 flex flex-col gap-3">
                    <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>Test Against Input</h3>
                    <InputBox
                        label="Test String"
                        value={testStr}
                        onChange={setTestStr}
                        placeholder="Enter text to test the regex against..."
                        type="input"
                        monospace
                    />
                    <button className="btn-secondary" onClick={testRegex}>Test</button>
                    {testResult && (
                        <div style={{ padding: '10px 14px', borderRadius: '8px', background: 'var(--bg-input)', fontSize: '0.875rem', color: 'var(--text-primary)' }}>
                            {testResult}
                        </div>
                    )}
                </div>
            )}

            {/* Examples */}
            <div>
                <h2 className="text-lg font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>Common regex patterns</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1rem' }}>
                    {REGEX_EXAMPLES.map((ex) => (
                        <ExampleCard
                            key={ex.slug}
                            title={ex.title}
                            description={ex.description}
                            expression={ex.pattern}
                            language="regex"
                            slug={`/regex/${ex.slug}`}
                            toolHref={`/regex-explainer?pattern=${encodeURIComponent(ex.pattern)}`}
                        />
                    ))}
                </div>
            </div>
        </ToolLayout>
    );
}

export default function RegexPage() {
    return <Suspense><RegexInner /></Suspense>;
}
