import { CRON_EXAMPLES, explainCron } from '@/lib/tools/cron';
import { buildToolMeta, buildHowToSchema, buildFAQSchema } from '@/lib/metadata';
import ToolLayout from '@/components/ToolLayout';
import OutputBox from '@/components/OutputBox';
import Link from 'next/link';
import type { Metadata } from 'next';

export async function generateStaticParams() {
    return CRON_EXAMPLES.map((ex) => ({ slug: ex.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const example = CRON_EXAMPLES.find((e) => e.slug === slug);
    if (!example) return { title: 'Cron Schedule | DevNet Tools' };

    return buildToolMeta({
        title: `Cron: ${example.label} — Expression & Explanation`,
        description: `${example.description} Cron expression: ${example.expr}. Copy-ready with full explanation.`,
        slug: `cron/${slug}`,
        keywords: ['cron', example.label.toLowerCase(), example.expr, 'cron expression', 'cron schedule'],
    });
}

export default async function CronSlugPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const example = CRON_EXAMPLES.find((e) => e.slug === slug);

    if (!example) {
        return (
            <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                <p>Cron schedule not found. <Link href="/cron">Back to Cron Generator →</Link></p>
            </div>
        );
    }

    const explanation = explainCron(example.expr);
    const fields = example.expr.split(' ');
    const fieldLabels = ['Minute', 'Hour', 'Day', 'Month', 'Weekday'];

    const schemas = [
        buildHowToSchema(`Use cron schedule: ${example.label}`, [
            `Open your crontab with: crontab -e`,
            `Add the expression: ${example.expr} /path/to/script.sh`,
            `Save and exit. The job will now run: ${explanation}`,
        ]),
        buildFAQSchema([
            { question: `What does "${example.expr}" mean?`, answer: explanation },
            { question: 'How do I add this to my server?', answer: 'Run crontab -e in your terminal, paste the expression followed by the command to run, then save the file.' },
            { question: 'Is cron time in UTC or local?', answer: 'Cron uses the system timezone. Cloud platforms often default to UTC. Adjust your hour field accordingly.' },
        ]),
    ];

    return (
        <ToolLayout
            title={`Cron: ${example.label}`}
            description={`${example.description} Ready-to-use cron expression with full explanation.`}
            badge="Cron Schedule"
            guideHref="/cron-guide"
            schemaJsonLd={schemas}
            faqs={[
                { question: `What does "${example.expr}" mean?`, answer: explanation },
                { question: 'How do I add this to my server?', answer: 'Run crontab -e in your terminal, add the expression followed by your command, and save. The job starts immediately.' },
                { question: 'Does this work on Linux and macOS?', answer: 'Yes. Standard cron syntax is compatible with Linux crontab and macOS launchd (with some syntax differences).' },
            ]}
        >
            {/* Expression */}
            <div className="glow-card p-5 flex flex-col gap-4">
                <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--accent)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>Expression</div>
                    <OutputBox value={example.expr} language="cron" minHeight="52px" />
                </div>

                {/* Field breakdown */}
                <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '10px' }}>Field Breakdown</div>
                    <div style={{ display: 'flex', gap: '6px', overflowX: 'auto' }}>
                        {fields.map((f, i) => (
                            <div key={i} style={{ textAlign: 'center', flex: '0 0 auto' }}>
                                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{fieldLabels[i]}</div>
                                <div style={{ fontFamily: 'monospace', fontWeight: 700, background: 'var(--bg-input)', border: '1px solid var(--border)', borderRadius: '6px', padding: '8px 14px', color: 'var(--accent)', fontSize: '1.1rem', minWidth: '48px' }}>
                                    {f}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Explanation */}
                <div style={{ background: 'rgba(6,182,212,0.08)', border: '1px solid rgba(6,182,212,0.2)', borderRadius: '8px', padding: '16px' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--accent)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>Plain English</div>
                    <p style={{ color: 'var(--text-primary)', fontSize: '1rem' }}>{explanation}</p>
                </div>

                {/* Usage example */}
                <div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>Linux Crontab Usage</div>
                    <OutputBox value={`${example.expr} /usr/bin/python3 /home/user/script.py`} language="bash" minHeight="52px" />
                </div>

                <div className="flex gap-2 flex-wrap">
                    <Link href={`/cron?expr=${encodeURIComponent(example.expr)}`} className="btn-primary">Open in Cron Generator</Link>
                    <Link href="/cron-guide" className="btn-secondary">Read Full Cron Guide</Link>
                </div>
            </div>

            {/* Other cron examples */}
            <div>
                <h2 className="text-lg font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>Other cron schedules</h2>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {CRON_EXAMPLES.filter((e) => e.slug !== slug).slice(0, 8).map((e) => (
                        <Link key={e.slug} href={`/cron/${e.slug}`} className="btn-ghost" style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>
                            {e.expr}
                        </Link>
                    ))}
                </div>
            </div>
        </ToolLayout>
    );
}
