import Link from 'next/link';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import ToolCard from '@/components/ToolCard';
import {
  Code2,
  Clock,
  SearchCode,
  Lock,
  Hash,
  Network,
  Globe,
  Shield,
} from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'DevNet Tools — Free Developer & Networking Utilities',
  description:
    'Free online tools for developers and network engineers. JSON to TypeScript converter, Cron generator, Regex explainer, Subnet calculator, Base64, UUID, IPv6 visualizer, and MikroTik tools.',
  openGraph: {
    title: 'DevNet Tools — Free Developer & Networking Utilities',
    description: 'Fast, free, client-side developer utilities. No signup required.',
    type: 'website',
  },
};

const tools = [
  {
    title: 'JSON → TypeScript',
    description: 'Instantly convert JSON objects to TypeScript interfaces. Supports nested types, arrays, and optional fields.',
    href: '/json-to-typescript',
    icon: Code2,
    tag: 'Dev',
  },
  {
    title: 'Cron Generator',
    description: 'Build and validate cron expressions with a human-readable builder. Get the exact schedule you need.',
    href: '/cron',
    icon: Clock,
    tag: 'DevOps',
  },
  {
    title: 'Regex Explainer',
    description: 'Paste any regex pattern and get a plain-English breakdown of every token, group, and quantifier.',
    href: '/regex-explainer',
    icon: SearchCode,
    tag: 'Dev',
  },
  {
    title: 'Base64 Encode/Decode',
    description: 'Encode plain text or decode Base64 strings instantly. Supports standard and URL-safe variants.',
    href: '/base64',
    icon: Lock,
    tag: 'Dev',
  },
  {
    title: 'UUID Generator',
    description: 'Generate RFC 4122 v4 UUIDs in bulk. Copy individual UUIDs or the full batch instantly.',
    href: '/uuid-generator',
    icon: Hash,
    tag: 'Dev',
    isNew: true,
  },
  {
    title: 'Subnet Calculator',
    description: 'Enter a CIDR range and get network address, broadcast, host range, and usable host count instantly.',
    href: '/subnet-calculator',
    icon: Network,
    tag: 'Network',
  },
  {
    title: 'IPv6 Visualizer',
    description: 'Expand, compress, and decode IPv6 addresses. Identify address types, prefixes, and subnet info.',
    href: '/ipv6-visualizer',
    icon: Globe,
    tag: 'Network',
  },
  {
    title: 'MikroTik Firewall Generator',
    description: 'Generate RouterOS firewall filter commands from a simple form. Copy and paste directly into your terminal.',
    href: '/mikrotik-firewall',
    icon: Shield,
    tag: 'MikroTik',
  },
];

const schemaWebSite = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'DevNet Tools',
  url: 'https://devnettools.com',
  description: 'Free developer and networking utilities',
  potentialAction: {
    '@type': 'SearchAction',
    target: 'https://devnettools.com/?q={search_term_string}',
    'query-input': 'required name=search_term_string',
  },
};

export default function HomePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaWebSite) }} />
      <div className="grid-bg" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <SiteHeader />

        {/* Hero */}
        <section style={{ maxWidth: '1280px', margin: '0 auto', padding: '5rem 1.5rem 3rem', width: '100%', textAlign: 'center' }}>
          <div className="flex justify-center mb-4">
            <span className="tag">Free · Client-side · No signup</span>
          </div>
          <h1
            style={{
              fontSize: 'clamp(2rem, 5vw, 3.5rem)',
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: '-0.03em',
              color: 'var(--text-primary)',
              marginBottom: '1.25rem',
            }}
          >
            Developer tools that{' '}
            <span className="gradient-text">actually work</span>
          </h1>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', maxWidth: '56ch', margin: '0 auto 2rem', lineHeight: 1.7 }}>
            Fast, client-side utilities for developers and network engineers. No ads tracking you. No data sent to servers. Just tools.
          </p>
          <div className="flex justify-center gap-3 flex-wrap">
            <a href="#tools" className="btn-primary">
              Browse Tools
            </a>
            <Link href="/cron-guide" className="btn-secondary">
              Learn Cron Expressions
            </Link>
          </div>

          {/* Stats row */}
          <div
            className="flex justify-center gap-8 flex-wrap"
            style={{ marginTop: '3.5rem', paddingTop: '2rem', borderTop: '1px solid var(--border)' }}
          >
            {[
              { label: 'Tools Available', value: '8' },
              { label: 'Runs Client-Side', value: '100%' },
              { label: 'Cost to Use', value: 'Free' },
            ].map((stat) => (
              <div key={stat.label} style={{ textAlign: 'center' }}>
                <div className="text-3xl font-bold gradient-text">{stat.value}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Tools Grid */}
        <section id="tools" style={{ maxWidth: '1280px', margin: '0 auto', padding: '1rem 1.5rem 4rem', width: '100%' }}>
          <div style={{ marginBottom: '2rem' }}>
            <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
              All Tools
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              Click any tool to open it. All processing happens in your browser.
            </p>
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '1.25rem',
            }}
          >
            {tools.map((tool) => (
              <ToolCard key={tool.href} {...tool} />
            ))}
          </div>
        </section>

        {/* Guides CTA */}
        <section
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
            padding: '2rem 1.5rem 5rem',
            width: '100%',
          }}
        >
          <div
            className="glow-card"
            style={{
              padding: '2.5rem',
              background: 'linear-gradient(135deg, rgba(6,182,212,0.08), rgba(59,130,246,0.05))',
              textAlign: 'center',
            }}
          >
            <h2 className="text-2xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>
              Not sure where to start?
            </h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
              Our guides explain core concepts with examples, diagrams, and ready-to-use snippets.
            </p>
            <div className="flex justify-center gap-3 flex-wrap">
              <Link href="/cron-guide" className="btn-secondary">📅 Cron Guide</Link>
              <Link href="/regex-guide" className="btn-secondary">🔍 Regex Guide</Link>
              <Link href="/subnet-guide" className="btn-secondary">🌐 Subnet Guide</Link>
              <Link href="/base64-guide" className="btn-secondary">🔒 Base64 Guide</Link>
            </div>
          </div>
        </section>

        <SiteFooter />
      </div>
    </>
  );
}
