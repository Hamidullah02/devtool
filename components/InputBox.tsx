'use client';

import { Lightbulb } from 'lucide-react';

interface InputBoxProps {
    label?: string;
    value: string;
    onChange: (val: string) => void;
    placeholder?: string;
    example?: string;
    rows?: number;
    monospace?: boolean;
    type?: 'textarea' | 'input';
    inputType?: string;
    id?: string;
}

export default function InputBox({
    label = 'Input',
    value,
    onChange,
    placeholder = 'Paste your input here...',
    example,
    rows = 8,
    monospace = false,
    type = 'textarea',
    inputType = 'text',
    id,
}: InputBoxProps) {
    return (
        <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
                <label
                    htmlFor={id}
                    className="text-sm font-medium"
                    style={{ color: 'var(--text-secondary)' }}
                >
                    {label}
                </label>
                {example && (
                    <button
                        type="button"
                        onClick={() => onChange(example)}
                        className="btn-ghost"
                        title="Load example"
                    >
                        <Lightbulb size={13} />
                        <span>Example</span>
                    </button>
                )}
            </div>
            {type === 'textarea' ? (
                <textarea
                    id={id}
                    className="input-field"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    rows={rows}
                    style={{ fontFamily: monospace ? "'JetBrains Mono', monospace" : 'inherit' }}
                    spellCheck={false}
                />
            ) : (
                <input
                    id={id}
                    type={inputType}
                    className="input-field"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    style={{ fontFamily: monospace ? "'JetBrains Mono', monospace" : 'inherit' }}
                    spellCheck={false}
                />
            )}
        </div>
    );
}
