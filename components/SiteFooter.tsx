'use client';

import Link from 'next/link';
import { Terminal, Github, Twitter } from 'lucide-react';

const footerLinks = {
    Tools: [
        { label: 'JSON → TypeScript', href: '/json-to-typescript' },
        { label: 'Cron Generator', href: '/cron' },
        { label: 'Regex Explainer', href: '/regex-explainer' },
        { label: 'Base64 Encode/Decode', href: '/base64' },
        { label: 'UUID Generator', href: '/uuid-generator' },
        { label: 'Subnet Calculator', href: '/subnet-calculator' },
        { label: 'IPv6 Visualizer', href: '/ipv6-visualizer' },
        { label: 'MikroTik Firewall', href: '/mikrotik-firewall' },
    ],
    Guides: [
        { label: 'Cron Expression Guide', href: '/cron-guide' },
        { label: 'Regex Cheat Sheet', href: '/regex-guide' },
        { label: 'Subnet Masking Guide', href: '/subnet-guide' },
        { label: 'Base64 Explained', href: '/base64-guide' },
    ],
};

export default function SiteFooter() {
    return (
        <footer
            style={{
                background: 'var(--bg-surface)',
                borderTop: '1px solid var(--border)',
                marginTop: 'auto',
            }}
        >
            <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '3rem 1.5rem 2rem' }}>
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
                        gap: '2rem',
                        marginBottom: '2.5rem',
                    }}
                >
                    {/* Brand */}
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                            <div style={{
                                background: 'linear-gradient(135deg, var(--accent), #3b82f6)',
                                borderRadius: '6px',
                                padding: '5px',
                                display: 'flex',
                            }}>
                                <Terminal size={14} color="#000" />
                            </div>
                            <span style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.95rem' }}>
                                DevNet<span style={{ color: 'var(--accent)' }}>Tools</span>
                            </span>
                        </div>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                            Free developer & networking utilities for engineers, students, and admins.
                        </p>
                    </div>

                    {/* Link columns */}
                    {Object.entries(footerLinks).map(([section, links]) => (
                        <div key={section}>
                            <h4 style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '12px' }}>
                                {section}
                            </h4>
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                {links.map((link) => (
                                    <li key={link.href}>
                                        <Link
                                            href={link.href}
                                            style={{ fontSize: '0.82rem', color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.15s' }}
                                            onMouseEnter={(e) => (e.target as HTMLAnchorElement).style.color = 'var(--accent)'}
                                            onMouseLeave={(e) => (e.target as HTMLAnchorElement).style.color = 'var(--text-muted)'}
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        © {new Date().getFullYear()} DevNet Tools. All rights reserved.
                    </p>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        Built for developers, by developers.
                    </p>
                </div>
            </div>
        </footer>
    );
}
