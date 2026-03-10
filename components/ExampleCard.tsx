'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Copy, Check, ArrowRight } from 'lucide-react';

interface ExampleCardProps {
    title: string;
    description?: string;
    expression: string;
    language?: string;
    slug?: string;
    toolHref?: string;
}

export default function ExampleCard({
    title,
    description,
    expression,
    language = 'text',
    slug,
    toolHref,
}: ExampleCardProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(expression);
        } catch {
            const el = document.createElement('textarea');
            el.value = expression;
            document.body.appendChild(el);
            el.select();
            document.execCommand('copy');
            document.body.removeChild(el);
        }
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="glow-card p-4 flex flex-col gap-3">
            <div>
                <h3 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
                    {title}
                </h3>
                {description && (
                    <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                        {description}
                    </p>
                )}
            </div>

            <div
                className="rounded-lg p-3 text-xs overflow-x-auto"
                style={{
                    background: 'var(--bg-input)',
                    border: '1px solid var(--border)',
                    fontFamily: "'JetBrains Mono', monospace",
                    color: '#a5f3fc',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-all',
                }}
            >
                {expression}
            </div>

            <div className="flex items-center justify-between gap-2">
                <button onClick={handleCopy} className="btn-ghost text-xs">
                    {copied ? (
                        <><Check size={12} style={{ color: 'var(--green)' }} /><span style={{ color: 'var(--green)' }}>Copied</span></>
                    ) : (
                        <><Copy size={12} /><span>Copy</span></>
                    )}
                </button>

                <div className="flex gap-2">
                    {slug && (
                        <Link href={slug} className="btn-ghost text-xs">
                            Details <ArrowRight size={11} />
                        </Link>
                    )}
                    {toolHref && (
                        <Link
                            href={toolHref}
                            className="btn-ghost text-xs"
                            style={{ borderColor: 'var(--border)', color: 'var(--accent)' }}
                        >
                            Open in Tool
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
}
