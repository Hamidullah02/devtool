import { buildToolMeta, buildFAQSchema } from '@/lib/metadata';
import ToolLayout from '@/components/ToolLayout';
import Link from 'next/link';
import type { Metadata } from 'next';
import { CRON_EXAMPLES } from '@/lib/tools/cron';

export const metadata: Metadata = buildToolMeta({
    title: 'Cron Expression Guide — How Cron Works',
    description: 'Complete guide to cron expressions. Learn the 5-field syntax, special characters, common schedules, and how to schedule recurring tasks on Linux, macOS, and servers.',
    slug: 'cron-guide',
    keywords: ['cron guide', 'cron expression explained', 'how cron works', 'crontab tutorial', 'cron syntax'],
});

const SYNTAX_TABLE = [
    { field: 'Minute', range: '0–59', example: '30 = at minute 30' },
    { field: 'Hour', range: '0–23', example: '14 = at 2 PM' },
    { field: 'Day of Month', range: '1–31', example: '15 = on the 15th' },
    { field: 'Month', range: '1–12', example: '6 = June' },
    { field: 'Day of Week', range: '0–6', example: '1 = Monday' },
];

const SPECIAL_CHARS = [
    { char: '*', meaning: 'Every value (wildcard)' },
    { char: '*/N', meaning: 'Every N-th value (step)' },
    { char: 'a,b', meaning: 'List of specific values' },
    { char: 'a-b', meaning: 'Range from a to b (inclusive)' },
    { char: '?', meaning: 'No specific value (some implementations)' },
];

export default function CronGuidePage() {
    const faqs = [
        { question: 'How many fields does a cron expression have?', answer: 'Standard cron has 5 fields: minute, hour, day-of-month, month, day-of-week. Some systems use 6 (adding seconds) or 7 (adding year).' },
        { question: 'What does * mean?', answer: '* means "every" — for every possible value in that field. * in the minute field means every minute.' },
        { question: 'What is the difference between cron and crontab?', answer: 'Cron is the daemon (background process) that executes scheduled tasks. Crontab is the file format and command (crontab -e) used to manage the schedule.' },
        { question: 'Can I use cron in Docker containers?', answer: 'Yes, but cron does not start automatically. You need to install a cron daemon (e.g., crond) and start it as part of your entrypoint.' },
    ];

    return (
        <ToolLayout
            title="Cron Expression Guide"
            description="Everything you need to understand and write cron expressions. From basic syntax to advanced patterns."
            badge="Guide"
            faqs={faqs}
        >
            {/* Intro */}
            <div className="glow-card p-5 flex flex-col gap-3">
                <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>What is a cron expression?</h2>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                    A cron expression is a 5-field string used to schedule recurring tasks (jobs) on Unix-like systems.
                    The cron daemon reads these expressions and executes associated commands at the specified times.
                </p>
                <div className="output-block" style={{ fontSize: '0.9rem' }}>
                    ┌───────────── minute (0–59){'\n'}
                    │ ┌─────────── hour (0–23){'\n'}
                    │ │ ┌───────── day of month (1–31){'\n'}
                    │ │ │ ┌─────── month (1–12){'\n'}
                    │ │ │ │ ┌───── day of week (0–6, Sun=0){'\n'}
                    │ │ │ │ │{'\n'}
                    * * * * *{'\n'}
                </div>
            </div>

            {/* Field reference */}
            <div className="glow-card p-5">
                <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Field Reference</h2>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.87rem' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--border)' }}>
                                {['Field', 'Range', 'Example'].map((h) => (
                                    <th key={h} style={{ textAlign: 'left', padding: '8px 12px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.72rem', letterSpacing: '0.06em' }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {SYNTAX_TABLE.map((row, i) => (
                                <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                                    <td style={{ padding: '10px 12px', color: 'var(--text-primary)', fontWeight: 600 }}>{row.field}</td>
                                    <td style={{ padding: '10px 12px', fontFamily: 'monospace', color: 'var(--accent)' }}>{row.range}</td>
                                    <td style={{ padding: '10px 12px', color: 'var(--text-secondary)' }}>{row.example}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Special characters */}
            <div className="glow-card p-5">
                <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Special Characters</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {SPECIAL_CHARS.map((sc) => (
                        <div key={sc.char} style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                            <code style={{ fontFamily: 'monospace', fontWeight: 700, color: 'var(--accent)', background: 'var(--bg-input)', border: '1px solid var(--border)', padding: '4px 10px', borderRadius: '6px', minWidth: '60px', textAlign: 'center' }}>{sc.char}</code>
                            <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{sc.meaning}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Common schedules */}
            <div>
                <h2 className="text-lg font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>Common Cron Schedules</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {CRON_EXAMPLES.map((ex) => (
                        <Link
                            key={ex.slug}
                            href={`/cron/${ex.slug}`}
                            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px', textDecoration: 'none', transition: 'border-color 0.15s' }}
                        >
                            <span style={{ color: 'var(--text-primary)', fontSize: '0.9rem' }}>{ex.label}</span>
                            <code style={{ fontFamily: 'monospace', color: 'var(--accent)', fontSize: '0.85rem' }}>{ex.expr}</code>
                        </Link>
                    ))}
                </div>
            </div>

            {/* CTA */}
            <div className="glow-card p-5 text-center" style={{ background: 'linear-gradient(135deg, rgba(6,182,212,0.08), rgba(59,130,246,0.05))' }}>
                <h3 className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>Ready to build your cron expression?</h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '16px', fontSize: '0.9rem' }}>Use the interactive builder to generate and test cron expressions instantly.</p>
                <Link href="/cron" className="btn-primary">Open Cron Generator →</Link>
            </div>
        </ToolLayout>
    );
}
