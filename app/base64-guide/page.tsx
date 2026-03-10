import { buildToolMeta } from '@/lib/metadata';
import ToolLayout from '@/components/ToolLayout';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = buildToolMeta({
    title: 'Base64 Encoding Explained — Complete Guide',
    description: 'Learn what Base64 encoding is, how it works, when to use it, and how it differs from encryption. Includes examples and a free online encoder/decoder.',
    slug: 'base64-guide',
    keywords: ['base64 guide', 'base64 explained', 'base64 encoding tutorial', 'base64 vs encryption', 'url safe base64'],
});

export default function Base64GuidePage() {
    const faqs = [
        { question: 'Is Base64 the same as encryption?', answer: 'No. Base64 is encoding — it is a reversible transformation that converts binary data to text. Anyone can decode it without a key. For encryption use AES, RSA, or similar.' },
        { question: 'Why does Base64 make data larger?', answer: 'Base64 represents 3 bytes of binary data as 4 ASCII characters, increasing size by approximately 33%.' },
        { question: 'When should I use URL-safe Base64?', answer: 'Use URL-safe Base64 when the encoded string appears in a URL, cookie, or filename. It replaces + with - and / with _ to avoid encoding conflicts.' },
        { question: 'Where is Base64 used?', answer: 'Email attachments (MIME), embedding images in CSS as data URIs, JWT tokens, HTTP Basic Authentication headers, and storing binary data in JSON.' },
    ];

    return (
        <ToolLayout
            title="Base64 Encoding — Complete Guide"
            description="Understand Base64 encoding: what it is, how it works byte-by-byte, URL-safe variants, and real-world usage."
            badge="Guide"
            faqs={faqs}
        >
            <div className="glow-card p-5 flex flex-col gap-3">
                <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>How Base64 Works</h2>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                    Base64 converts binary data into a printable ASCII string using an alphabet of 64 characters:
                    A–Z, a–z, 0–9, +, / (with = for padding).
                </p>
                <div className="output-block" style={{ fontSize: '0.85rem' }}>
                    Input:    H        e        l{'\n'}
                    ASCII:    72       101      108{'\n'}
                    Binary:   01001000 01100101 01101100{'\n'}
                    |——————————————————————|{'\n'}
                    Groups:   010010 000110 010101 101100{'\n'}
                    Decimal:  18     6      21     44{'\n'}
                    Base64:   S      G      V      s{'\n'}
                    {'→ "Hel" encodes to "SGVs"'}
                </div>
            </div>

            <div className="glow-card p-5">
                <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Standard vs URL-Safe</h2>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.87rem' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--border)' }}>
                                {['Feature', 'Standard', 'URL-Safe'].map((h) => (
                                    <th key={h} style={{ textAlign: 'left', padding: '8px 12px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.72rem', letterSpacing: '0.06em' }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {[
                                { feature: 'Char 62', std: '+', safe: '-' },
                                { feature: 'Char 63', std: '/', safe: '_' },
                                { feature: 'Padding', std: '= (required)', safe: 'Omitted' },
                                { feature: 'Use case', std: 'Email, files', safe: 'URL, JWT, cookie' },
                            ].map((row) => (
                                <tr key={row.feature} style={{ borderBottom: '1px solid var(--border)' }}>
                                    <td style={{ padding: '10px 12px', color: 'var(--text-secondary)' }}>{row.feature}</td>
                                    <td style={{ padding: '10px 12px', fontFamily: 'monospace', color: 'var(--text-primary)' }}>{row.std}</td>
                                    <td style={{ padding: '10px 12px', fontFamily: 'monospace', color: 'var(--accent)' }}>{row.safe}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="glow-card p-5 text-center" style={{ background: 'linear-gradient(135deg, rgba(6,182,212,0.08), rgba(59,130,246,0.05))' }}>
                <h3 className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>Encode or decode instantly</h3>
                <Link href="/base64" className="btn-primary">Open Base64 Tool →</Link>
            </div>
        </ToolLayout>
    );
}
