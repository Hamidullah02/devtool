import { MIKROTIK_RULES, generateFirewallRule } from '@/lib/tools/mikrotik';
import { buildToolMeta, buildHowToSchema, buildFAQSchema } from '@/lib/metadata';
import ToolLayout from '@/components/ToolLayout';
import OutputBox from '@/components/OutputBox';
import Link from 'next/link';
import type { Metadata } from 'next';

export async function generateStaticParams() {
    return MIKROTIK_RULES.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const rule = MIKROTIK_RULES.find((r) => r.slug === slug);
    if (!rule) return { title: 'MikroTik Rule | DevNet Tools' };

    return buildToolMeta({
        title: `MikroTik: ${rule.label} — RouterOS Firewall Rule`,
        description: `${rule.description} Copy-ready RouterOS /ip firewall filter command with explanation.`,
        slug: `mikrotik-firewall/${slug}`,
        keywords: ['mikrotik', 'routeros', 'firewall', rule.label.toLowerCase(), 'ip firewall filter', '/ip firewall filter add'],
    });
}

export default async function MikrotikSlugPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const rule = MIKROTIK_RULES.find((r) => r.slug === slug);

    if (!rule) {
        return (
            <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                <p>Rule not found. <Link href="/mikrotik-firewall">Back to MikroTik Generator →</Link></p>
            </div>
        );
    }

    const command = generateFirewallRule(rule.rule);

    const schemas = [
        buildHowToSchema(`Apply MikroTik rule: ${rule.label}`, [
            `Open your MikroTik router via Winbox or SSH`,
            `Open the Terminal (New Terminal in Winbox, or SSH to the router IP)`,
            `Paste this command: ${command}`,
            `Verify with: /ip firewall filter print`,
        ]),
        buildFAQSchema([
            { question: `What does the "${rule.label}" rule do?`, answer: rule.longDescription },
            { question: 'How do I apply this to my MikroTik router?', answer: 'Open Winbox, go to New Terminal, and paste the command. Or SSH into the router and paste it directly. Verify with /ip firewall filter print.' },
            { question: 'Where should this rule be placed in the firewall list?', answer: 'Rule order matters in RouterOS. Rules are evaluated top to bottom. Generally, ACCEPT established/related rules go first, DROP invalid goes second, then specific rules, then default-deny last.' },
        ]),
    ];

    const relatedRules = rule.relatedSlugs
        ?.map((s) => MIKROTIK_RULES.find((r) => r.slug === s))
        .filter(Boolean) ?? [];

    return (
        <ToolLayout
            title={`MikroTik: ${rule.label}`}
            description={rule.description}
            badge="MikroTik RouterOS"
            guideHref="/mikrotik-firewall"
            schemaJsonLd={schemas}
            faqs={[
                { question: `What does "${rule.label}" do?`, answer: rule.longDescription },
                { question: 'How do I apply this firewall rule?', answer: 'SSH into your MikroTik or open Winbox → New Terminal. Paste the command and press Enter. The rule takes effect immediately.' },
                { question: 'Does this affect existing connections?', answer: 'MikroTik firewall rules apply to new connections by default. Existing established sessions tracked in the connection table are not immediately dropped.' },
                { question: 'How do I remove this rule if needed?', answer: 'Run /ip firewall filter print to find the rule number, then /ip firewall filter remove numbers=X (where X is the number).' },
            ]}
        >
            {/* RouterOS Command */}
            <div className="glow-card p-5 flex flex-col gap-4">
                <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--accent)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>RouterOS Command</div>
                    <OutputBox value={command} language="routeros" minHeight="80px" />
                </div>

                {/* Rule field breakdown */}
                <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '10px' }}>Rule Parameters</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {Object.entries(rule.rule).filter(([, v]) => v !== undefined && v !== '' && !(Array.isArray(v) && v.length === 0)).map(([k, v]) => (
                            <div key={k} style={{ background: 'var(--bg-input)', border: '1px solid var(--border)', borderRadius: '6px', padding: '4px 10px', fontSize: '0.78rem', fontFamily: 'monospace' }}>
                                <span style={{ color: 'var(--text-muted)' }}>{k}=</span>
                                <span style={{ color: 'var(--accent)' }}>{Array.isArray(v) ? v.join(',') : String(v)}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex gap-2 flex-wrap">
                    <Link href={`/mikrotik-firewall`} className="btn-primary">Open in Generator</Link>
                </div>
            </div>

            {/* Long-form explanation */}
            <div className="glow-card p-5 flex flex-col gap-4">
                <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>What This Rule Does</h2>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '0.95rem' }}>{rule.longDescription}</p>

                {rule.warning && (
                    <div style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.25)', borderRadius: '8px', padding: '12px 16px' }}>
                        <div style={{ fontSize: '0.75rem', color: '#f59e0b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>⚠️ Warning</div>
                        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{rule.warning}</p>
                    </div>
                )}
            </div>

            {/* Use cases */}
            <div className="glow-card p-5 flex flex-col gap-3">
                <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>Common Use Cases</h2>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {rule.useCases.map((uc, i) => (
                        <li key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                            <span style={{ color: 'var(--accent)', fontWeight: 700, flexShrink: 0, marginTop: '1px' }}>→</span>
                            <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{uc}</span>
                        </li>
                    ))}
                </ul>
            </div>

            {/* How to apply */}
            <div className="glow-card p-5 flex flex-col gap-3">
                <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>How to Apply via Terminal</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {[
                        'Connect via Winbox → New Terminal, or SSH to the router IP',
                        'Paste the command above and press Enter',
                        'Run: /ip firewall filter print to verify the rule was added',
                        'Test your network to ensure it behaves as expected',
                        'If needed, remove with: /ip firewall filter remove numbers=X',
                    ].map((step, i) => (
                        <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                            <div style={{ background: 'rgba(6,182,212,0.12)', border: '1px solid rgba(6,182,212,0.3)', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 700, color: 'var(--accent)', flexShrink: 0 }}>{i + 1}</div>
                            <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6, paddingTop: '3px' }}>{step}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Related rules */}
            {relatedRules.length > 0 && (
                <div>
                    <h2 className="text-lg font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>Related MikroTik Rules</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1rem' }}>
                        {relatedRules.map((r) => r && (
                            <Link key={r.slug} href={`/mikrotik-firewall/${r.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                <div className="glow-card p-4 flex flex-col gap-2" style={{ cursor: 'pointer', height: '100%' }}>
                                    <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)' }}>{r.label}</div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{r.description}</div>
                                    <div style={{ marginTop: 'auto', fontSize: '0.78rem', color: 'var(--accent)', fontFamily: 'monospace' }}>chain={r.rule.chain} action={r.rule.action}</div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {/* All rules listing */}
            <div>
                <h2 className="text-lg font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>All MikroTik Firewall Rules</h2>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {MIKROTIK_RULES.filter((r) => r.slug !== slug).map((r) => (
                        <Link key={r.slug} href={`/mikrotik-firewall/${r.slug}`} className="btn-ghost" style={{ fontSize: '0.8rem' }}>
                            {r.label}
                        </Link>
                    ))}
                </div>
            </div>
        </ToolLayout>
    );
}
