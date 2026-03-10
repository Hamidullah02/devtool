import { buildToolMeta } from '@/lib/metadata';
import ToolLayout from '@/components/ToolLayout';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = buildToolMeta({
    title: 'Subnet Masking Guide — CIDR, Subnets & IP Ranges Explained',
    description: 'Complete subnetting guide. Learn CIDR notation, subnet masks, network classes, wildcard masks, and how to calculate host ranges and broadcast addresses.',
    slug: 'subnet-guide',
    keywords: ['subnet guide', 'CIDR explained', 'subnetting tutorial', 'subnet mask', 'ip address classes', 'network calculator'],
});

const CIDR_TABLE = [
    { cidr: '/8', mask: '255.0.0.0', hosts: '16,777,214', class: 'A' },
    { cidr: '/16', mask: '255.255.0.0', hosts: '65,534', class: 'B' },
    { cidr: '/24', mask: '255.255.255.0', hosts: '254', class: 'C' },
    { cidr: '/25', mask: '255.255.255.128', hosts: '126', class: 'C' },
    { cidr: '/26', mask: '255.255.255.192', hosts: '62', class: 'C' },
    { cidr: '/27', mask: '255.255.255.224', hosts: '30', class: 'C' },
    { cidr: '/28', mask: '255.255.255.240', hosts: '14', class: 'C' },
    { cidr: '/30', mask: '255.255.255.252', hosts: '2', class: 'P2P' },
];

export default function SubnetGuidePage() {
    const faqs = [
        { question: 'What is a subnet?', answer: 'A subnet (subnetwork) is a logical subdivision of an IP network. Subnetting divides a large network into smaller, more manageable segments.' },
        { question: 'What does /24 mean?', answer: '/24 means the first 24 bits are the network portion. This leaves 8 bits for hosts, giving 2^8 = 256 addresses (254 usable, minus network and broadcast).' },
        { question: 'What is the wildcard mask?', answer: 'The wildcard mask is the bitwise inverse of the subnet mask. 255.255.255.0 becomes 0.0.0.255. Used in routing protocols and access-control lists.' },
        { question: 'Why are /30 subnets used for point-to-point links?', answer: '/30 gives exactly 2 usable hosts, perfect for connecting two routers with no wasted addresses.' },
    ];

    return (
        <ToolLayout
            title="Subnet Masking & CIDR Guide"
            description="Learn subnetting from the ground up. Understand CIDR notation, calculate host ranges, and design IP addressing schemes."
            badge="Guide"
            faqs={faqs}
        >
            {/* ASCII diagram */}
            <div className="glow-card p-5 flex flex-col gap-3">
                <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>How CIDR Works</h2>
                <div className="output-block" style={{ fontSize: '0.85rem' }}>
                    IP Address:   192  . 168  .  1  .  0{'\n'}
                    Binary:    11000000.10101000.00000001.00000000{'\n'}
                    |←————————————————→| |←———→|{'\n'}
                    /24:         Network (24 bits)    Host (8 bits){'\n'}
                    = 256 addresses{'\n'}
                    = 254 usable hosts
                </div>
            </div>

            {/* CIDR reference table */}
            <div className="glow-card p-5">
                <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>CIDR Quick Reference</h2>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.87rem' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--border)' }}>
                                {['CIDR', 'Subnet Mask', 'Usable Hosts', 'Class'].map((h) => (
                                    <th key={h} style={{ textAlign: 'left', padding: '8px 12px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.72rem', letterSpacing: '0.06em' }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {CIDR_TABLE.map((row) => (
                                <tr key={row.cidr} style={{ borderBottom: '1px solid var(--border)' }}>
                                    <td style={{ padding: '10px 12px', fontFamily: 'monospace', fontWeight: 700, color: 'var(--accent)' }}>{row.cidr}</td>
                                    <td style={{ padding: '10px 12px', fontFamily: 'monospace', color: 'var(--text-primary)' }}>{row.mask}</td>
                                    <td style={{ padding: '10px 12px', color: 'var(--text-secondary)' }}>{row.hosts}</td>
                                    <td style={{ padding: '10px 12px', color: 'var(--text-secondary)' }}>{row.class}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="glow-card p-5 text-center" style={{ background: 'linear-gradient(135deg, rgba(6,182,212,0.08), rgba(59,130,246,0.05))' }}>
                <h3 className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>Calculate any subnet instantly</h3>
                <Link href="/subnet-calculator" className="btn-primary">Open Subnet Calculator →</Link>
            </div>
        </ToolLayout>
    );
}
