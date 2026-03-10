import { buildToolMeta } from '@/lib/metadata';
import ToolLayout from '@/components/ToolLayout';
import Link from 'next/link';
import type { Metadata } from 'next';
import { REGEX_EXAMPLES } from '@/lib/tools/regex';

export const metadata: Metadata = buildToolMeta({
    title: 'Regex Cheat Sheet & Guide — Regular Expressions Explained',
    description: 'Complete regex reference guide. Learn anchors, groups, quantifiers, character classes, lookaheads, and common patterns with copy-ready examples.',
    slug: 'regex-guide',
    keywords: ['regex guide', 'regular expression cheat sheet', 'regex tutorial', 'regex syntax', 'regex patterns'],
});

const TOKEN_TYPES = [
    { symbol: '^', type: 'Anchor', desc: 'Start of string' },
    { symbol: '$', type: 'Anchor', desc: 'End of string' },
    { symbol: '.', type: 'Special', desc: 'Any character except newline' },
    { symbol: '\\d', type: 'Special', desc: 'Any digit [0-9]' },
    { symbol: '\\w', type: 'Special', desc: 'Word char [a-zA-Z0-9_]' },
    { symbol: '\\s', type: 'Special', desc: 'Whitespace (space, tab, newline)' },
    { symbol: '\\b', type: 'Anchor', desc: 'Word boundary' },
    { symbol: '[abc]', type: 'Char Class', desc: 'Any of a, b, or c' },
    { symbol: '[^abc]', type: 'Char Class', desc: 'Any character NOT a, b, c' },
    { symbol: '[a-z]', type: 'Char Class', desc: 'Range: a through z' },
    { symbol: '*', type: 'Quantifier', desc: 'Zero or more (greedy)' },
    { symbol: '+', type: 'Quantifier', desc: 'One or more (greedy)' },
    { symbol: '?', type: 'Quantifier', desc: 'Zero or one (optional)' },
    { symbol: '{n}', type: 'Quantifier', desc: 'Exactly n times' },
    { symbol: '{n,m}', type: 'Quantifier', desc: 'Between n and m times' },
    { symbol: '(abc)', type: 'Group', desc: 'Capturing group' },
    { symbol: '(?:abc)', type: 'Group', desc: 'Non-capturing group' },
    { symbol: '(?=abc)', type: 'Lookahead', desc: 'Positive lookahead' },
    { symbol: '(?!abc)', type: 'Lookahead', desc: 'Negative lookahead' },
    { symbol: 'a|b', type: 'Alternation', desc: 'Match a OR b' },
];

const COLOR_MAP: Record<string, string> = {
    Anchor: '#f59e0b', Special: '#f87171', 'Char Class': '#60a5fa',
    Quantifier: '#34d399', Group: '#a78bfa', Lookahead: '#e879f9', Alternation: '#94a3b8',
};

export default function RegexGuidePage() {
    const faqs = [
        { question: 'What is a regex?', answer: 'A regular expression is a pattern that describes a set of strings. It is used for searching, validating, and transforming text in nearly every programming language.' },
        { question: 'Are regex patterns the same in all languages?', answer: 'Mostly, but there are differences. JavaScript, Python, PHP, and Java all share core syntax but differ in lookbehind support, Unicode handling, and some flags.' },
        { question: 'What does greedy vs lazy mean?', answer: 'Greedy quantifiers (*, +) match as much as possible. Lazy quantifiers (*?, +?) match as little as possible. Example: <.*> matches the entire "<a>text</a>" (greedy), while <.*?> only matches "<a>".' },
        { question: 'How do I escape special characters?', answer: 'Prefix the character with a backslash: \\. for a literal dot, \\* for a literal asterisk, \\( for a literal parenthesis, etc.' },
    ];

    return (
        <ToolLayout
            title="Regex Cheat Sheet & Guide"
            description="Your complete reference for writing regular expressions. Covers syntax, tokens, quantifiers, groups, and real-world patterns."
            badge="Guide"
            faqs={faqs}
        >
            {/* Quick reference table */}
            <div className="glow-card p-5">
                <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Token Reference</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '8px' }}>
                    {TOKEN_TYPES.map((t) => (
                        <div key={t.symbol} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', padding: '8px', background: 'var(--bg-input)', borderRadius: '6px', border: `1px solid ${COLOR_MAP[t.type] || 'var(--border)'}30` }}>
                            <code style={{ fontFamily: 'monospace', fontWeight: 700, color: COLOR_MAP[t.type] || 'var(--accent)', minWidth: '64px', fontSize: '0.85rem' }}>{t.symbol}</code>
                            <div>
                                <div style={{ fontSize: '0.7rem', color: COLOR_MAP[t.type] || 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{t.type}</div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{t.desc}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Common patterns */}
            <div>
                <h2 className="text-lg font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>Copy-Ready Patterns</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {REGEX_EXAMPLES.map((ex) => (
                        <Link
                            key={ex.slug}
                            href={`/regex/${ex.slug}`}
                            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px', textDecoration: 'none', gap: '1rem' }}
                        >
                            <span style={{ color: 'var(--text-primary)', fontWeight: 500, whiteSpace: 'nowrap' }}>{ex.title}</span>
                            <code style={{ fontFamily: 'monospace', color: 'var(--accent)', fontSize: '0.78rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ex.pattern}</code>
                        </Link>
                    ))}
                </div>
            </div>

            <div className="glow-card p-5 text-center" style={{ background: 'linear-gradient(135deg, rgba(6,182,212,0.08), rgba(59,130,246,0.05))' }}>
                <h3 className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>Paste and explain any regex instantly</h3>
                <Link href="/regex-explainer" className="btn-primary">Open Regex Explainer →</Link>
            </div>
        </ToolLayout>
    );
}
