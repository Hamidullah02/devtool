'use client';

import { useState, useCallback, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import ToolLayout from '@/components/ToolLayout';
import OutputBox from '@/components/OutputBox';
import ExampleCard from '@/components/ExampleCard';
import { buildCronExpression, explainCron, CRON_EXAMPLES } from '@/lib/tools/cron';
import { Clock, Zap } from 'lucide-react';
import Link from 'next/link';
import { safeDecodeURI } from '@/lib/utils';

const FAQS = [
    { question: 'What is a cron expression?', answer: 'A cron expression is a 5-field string (minute hour day month weekday) used to schedule recurring tasks. Each field can be a number, wildcard, range, or step interval.' },
    { question: 'What does */5 mean?', answer: 'The */ syntax means "every N". So */5 in the minute field means "every 5 minutes".' },
    { question: 'How do I run something at midnight?', answer: 'Use: 0 0 * * * — minute 0, hour 0, every day, every month, any weekday.' },
    { question: 'Are cron times in UTC?', answer: 'It depends on your server timezone. Most Linux systems run cron in the system timezone. Many cloud schedulers use UTC, so adjust your hour field accordingly.' },
];

const FIELDS = ['minute', 'hour', 'dayOfMonth', 'month', 'dayOfWeek'] as const;
type CronField = typeof FIELDS[number];

const FIELD_LABELS: Record<CronField, string> = {
    minute: 'Minute', hour: 'Hour', dayOfMonth: 'Day of Month', month: 'Month', dayOfWeek: 'Day of Week',
};
const FIELD_PLACEHOLDERS: Record<CronField, string> = {
    minute: '0-59 or *', hour: '0-23 or *', dayOfMonth: '1-31 or *', month: '1-12 or *', dayOfWeek: '0-6 or *',
};

function CronInner() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [parts, setParts] = useState<Record<CronField, string>>({ minute: '*', hour: '*', dayOfMonth: '*', month: '*', dayOfWeek: '*' });
    const [rawExpr, setRawExpr] = useState(searchParams.get('expr') || '');
    const [mode, setMode] = useState<'builder' | 'raw'>('builder');
    const [explanation, setExplanation] = useState('');

    const currentExpr = mode === 'raw' ? rawExpr : buildCronExpression(parts as any);

    const updateExplanation = useCallback((expr: string) => {
        const exp = explainCron(expr);
        setExplanation(exp);
        router.replace(`/cron?expr=${encodeURIComponent(expr)}`, { scroll: false });
    }, [router]);

    useEffect(() => {
        const e = searchParams.get('expr');
        if (e) {
            setRawExpr(safeDecodeURI(e));
            setMode('raw');
            setExplanation(explainCron(safeDecodeURI(e)));
        } else {
            updateExplanation(currentExpr);
        }
    }, []);

    return (
        <ToolLayout
            title="Cron Expression Generator"
            description="Build cron expressions with a visual builder or raw editor. Get instant human-readable explanations of any cron schedule."
            badge="DevOps"
            guideHref="/cron-guide"
            faqs={FAQS}
        >
            {/* Mode toggle */}
            <div className="glow-card p-5 flex flex-col gap-4">
                <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>
                    {(['builder', 'raw'] as const).map((m) => (
                        <button key={m} onClick={() => setMode(m)} className={mode === m ? 'btn-primary' : 'btn-secondary'} style={{ padding: '6px 16px', fontSize: '0.82rem' }}>
                            {m === 'builder' ? '⚙️ Builder' : '✏️ Raw Editor'}
                        </button>
                    ))}
                </div>

                {mode === 'builder' ? (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '1rem' }}>
                        {FIELDS.map((field) => (
                            <div key={field} className="flex flex-col gap-1">
                                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                    {FIELD_LABELS[field]}
                                </label>
                                <input
                                    className="input-field"
                                    style={{ fontFamily: 'monospace', textAlign: 'center' }}
                                    value={parts[field]}
                                    placeholder={FIELD_PLACEHOLDERS[field]}
                                    onChange={(e) => setParts((p) => ({ ...p, [field]: e.target.value || '*' }))}
                                />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div>
                        <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Raw Cron Expression</label>
                        <input
                            className="input-field"
                            style={{ fontFamily: 'monospace', fontSize: '1.1rem' }}
                            value={rawExpr}
                            placeholder="* * * * *"
                            onChange={(e) => setRawExpr(e.target.value)}
                        />
                    </div>
                )}

                <button id="explain-btn" className="btn-primary" onClick={() => updateExplanation(currentExpr)}>
                    <Zap size={15} /> Generate & Explain
                </button>

                {/* Output */}
                <div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>Expression</div>
                    <OutputBox value={currentExpr} language="cron" minHeight="52px" />
                </div>

                {explanation && (
                    <div style={{ background: 'rgba(6,182,212,0.08)', border: '1px solid rgba(6,182,212,0.2)', borderRadius: '8px', padding: '14px' }}>
                        <div style={{ fontSize: '0.75rem', color: 'var(--accent)', fontWeight: 600, marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Plain English</div>
                        <div style={{ color: 'var(--text-primary)', fontSize: '0.95rem' }}>{explanation}</div>
                    </div>
                )}
            </div>

            {/* Pre-built examples */}
            <div>
                <h2 className="text-lg font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
                    Common cron schedules
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1rem' }}>
                    {CRON_EXAMPLES.slice(0, 8).map((ex) => (
                        <ExampleCard
                            key={ex.slug}
                            title={ex.label}
                            description={ex.description}
                            expression={ex.expr}
                            language="cron"
                            slug={`/cron/${ex.slug}`}
                            toolHref={`/cron?expr=${encodeURIComponent(ex.expr)}`}
                        />
                    ))}
                </div>
                <div style={{ marginTop: '12px' }}>
                    <Link href="/cron-guide" className="btn-ghost">View all cron examples in the guide →</Link>
                </div>
            </div>
        </ToolLayout>
    );
}

export default function CronPage() {
    return <Suspense><CronInner /></Suspense>;
}
