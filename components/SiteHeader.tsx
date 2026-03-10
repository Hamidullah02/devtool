'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Terminal, Menu, X } from 'lucide-react';

const navLinks = [
    { label: 'Tools', href: '/#tools' },
    { label: 'Cron Guide', href: '/cron-guide' },
    { label: 'Regex Guide', href: '/regex-guide' },
    { label: 'Subnet Guide', href: '/subnet-guide' },
];

export default function SiteHeader() {
    const [open, setOpen] = useState(false);

    return (
        <header
            style={{
                background: 'rgba(10,14,26,0.9)',
                backdropFilter: 'blur(12px)',
                borderBottom: '1px solid var(--border)',
                position: 'sticky',
                top: 0,
                zIndex: 50,
            }}
        >
            <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem' }}>
                <div className="flex items-center justify-between" style={{ height: '60px' }}>
                    {/* Logo */}
                    <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
                        <div style={{
                            background: 'linear-gradient(135deg, var(--accent), #3b82f6)',
                            borderRadius: '8px',
                            padding: '6px',
                            display: 'flex',
                        }}>
                            <Terminal size={18} color="#000" />
                        </div>
                        <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                            DevNet<span style={{ color: 'var(--accent)' }}>Tools</span>
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center gap-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                style={{
                                    padding: '6px 14px',
                                    borderRadius: '6px',
                                    fontSize: '0.875rem',
                                    color: 'var(--text-secondary)',
                                    textDecoration: 'none',
                                    transition: 'color 0.15s, background 0.15s',
                                }}
                                onMouseEnter={(e) => {
                                    (e.target as HTMLAnchorElement).style.color = 'var(--accent)';
                                    (e.target as HTMLAnchorElement).style.background = 'var(--accent-glow)';
                                }}
                                onMouseLeave={(e) => {
                                    (e.target as HTMLAnchorElement).style.color = 'var(--text-secondary)';
                                    (e.target as HTMLAnchorElement).style.background = 'transparent';
                                }}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>

                    {/* Mobile toggle */}
                    <button
                        className="btn-ghost md:hidden"
                        onClick={() => setOpen(!open)}
                        aria-label="Toggle menu"
                    >
                        {open ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>

                {/* Mobile Nav */}
                {open && (
                    <nav
                        className="md:hidden flex flex-col gap-1 pb-4"
                        style={{ borderTop: '1px solid var(--border)', paddingTop: '12px' }}
                    >
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setOpen(false)}
                                style={{
                                    padding: '10px 12px',
                                    borderRadius: '6px',
                                    fontSize: '0.9rem',
                                    color: 'var(--text-secondary)',
                                    textDecoration: 'none',
                                    display: 'block',
                                }}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>
                )}
            </div>
        </header>
    );
}
