'use client';

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface OutputBoxProps {
    label?: string;
    value: string;
    language?: string;
    minHeight?: string;
    placeholder?: string;
}

export default function OutputBox({
    label = 'Output',
    value,
    language = 'text',
    minHeight = '160px',
    placeholder = 'Output will appear here...',
}: OutputBoxProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        if (!value) return;
        try {
            await navigator.clipboard.writeText(value);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            // fallback
            const el = document.createElement('textarea');
            el.value = value;
            document.body.appendChild(el);
            el.select();
            document.execCommand('copy');
            document.body.removeChild(el);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
                <label className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                    {label}
                    {language !== 'text' && (
                        <span className="ml-2 tag">{language}</span>
                    )}
                </label>
                <button
                    id="copy-output-btn"
                    onClick={handleCopy}
                    disabled={!value}
                    className="btn-ghost"
                    style={{
                        opacity: value ? 1 : 0.4,
                        cursor: value ? 'pointer' : 'not-allowed',
                    }}
                    title="Copy to clipboard"
                >
                    {copied ? (
                        <>
                            <Check size={14} style={{ color: 'var(--green)' }} />
                            <span style={{ color: 'var(--green)' }}>Copied!</span>
                        </>
                    ) : (
                        <>
                            <Copy size={14} />
                            <span>Copy</span>
                        </>
                    )}
                </button>
            </div>
            <div
                className="output-block"
                style={{ minHeight, scrollbarWidth: 'thin' }}
            >
                {value || <span style={{ color: 'var(--text-muted)', fontFamily: 'inherit' }}>{placeholder}</span>}
            </div>
        </div>
    );
}
