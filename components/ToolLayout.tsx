import SiteHeader from './SiteHeader';
import SiteFooter from './SiteFooter';
import AdSlot from './AdSlot';

interface ToolLayoutProps {
    children: React.ReactNode;
    title: string;
    description: string;
    badge?: string;
    guideHref?: string;
    faqs?: { question: string; answer: string }[];
    schemaJsonLd?: object[];
}

export default function ToolLayout({
    children,
    title,
    description,
    badge,
    guideHref,
    faqs = [],
    schemaJsonLd = [],
}: ToolLayoutProps) {
    return (
        <>
            {schemaJsonLd.map((schema, i) => (
                <script
                    key={i}
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
                />
            ))}

            <div className="grid-bg" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
                <SiteHeader />

                {/* Header Ad Banner */}
                <div style={{ maxWidth: '1280px', margin: '16px auto 0', padding: '0 1.5rem', width: '100%' }}>
                    <AdSlot placement="header" />
                </div>

                {/* Page Header */}
                <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2.5rem 1.5rem 0', width: '100%' }}>
                    <div className="flex flex-wrap items-center gap-3 mb-1">
                        {badge && <span className="tag">{badge}</span>}
                        {guideHref && (
                            <a href={guideHref} style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textDecoration: 'none' }}>
                                📖 Read the guide →
                            </a>
                        )}
                    </div>
                    <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                        {title}
                    </h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', maxWidth: '60ch', lineHeight: 1.6 }}>
                        {description}
                    </p>
                </div>

                {/* Main Content */}
                <main
                    style={{
                        maxWidth: '1280px',
                        margin: '2rem auto',
                        padding: '0 1.5rem',
                        width: '100%',
                        flex: 1,
                        display: 'grid',
                        gridTemplateColumns: '1fr auto',
                        gap: '2rem',
                        alignItems: 'start',
                    }}
                >
                    {/* Tool Column */}
                    <div className="flex flex-col gap-6 min-w-0">
                        {children}

                        {/* Below-output Ad */}
                        <AdSlot placement="below-output" />

                        {/* FAQ Section */}
                        {faqs.length > 0 && (
                            <section>
                                <h2 className="text-xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
                                    Frequently Asked Questions
                                </h2>
                                <div className="flex flex-col gap-3">
                                    {faqs.map((faq, i) => (
                                        <details
                                            key={i}
                                            className="glow-card"
                                            style={{ padding: '1rem 1.25rem' }}
                                        >
                                            <summary
                                                style={{
                                                    cursor: 'pointer',
                                                    fontWeight: 600,
                                                    fontSize: '0.9rem',
                                                    color: 'var(--text-primary)',
                                                    listStyle: 'none',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'space-between',
                                                    gap: '1rem',
                                                }}
                                            >
                                                {faq.question}
                                                <span style={{ color: 'var(--accent)', flexShrink: 0, fontSize: '1.1rem' }}>+</span>
                                            </summary>
                                            <p style={{ marginTop: '12px', color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.7 }}>
                                                {faq.answer}
                                            </p>
                                        </details>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>

                    {/* Sidebar Ad — desktop only */}
                    <aside className="hidden lg:block" style={{ width: '300px', flexShrink: 0, position: 'sticky', top: '80px' }}>
                        <AdSlot placement="sidebar" />
                    </aside>
                </main>

                <SiteFooter />
            </div>
        </>
    );
}
