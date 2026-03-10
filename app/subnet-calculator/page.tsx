'use client';

import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import ToolLayout from '@/components/ToolLayout';
import InputBox from '@/components/InputBox';
import { calculateSubnet, SubnetInfo } from '@/lib/tools/subnet';
import { safeDecodeURI } from '@/lib/utils';
import { Zap } from 'lucide-react';

const FAQS = [
    { question: 'What is CIDR notation?', answer: 'CIDR (Classless Inter-Domain Routing) notation combines an IP address and a prefix length: e.g., 192.168.1.0/24. The /24 means 24 bits are used for the network, leaving 8 bits for hosts.' },
    { question: 'How many hosts can /24 hold?', answer: 'A /24 subnet has 256 total addresses (2^8). Subtract 2 (network and broadcast), leaving 254 usable hosts.' },
    { question: 'What is the wildcard mask?', answer: 'The wildcard mask is the inverse of the subnet mask. It is used in Cisco/MikroTik access-control lists. For /24: subnet mask 255.255.255.0, wildcard 0.0.0.255.' },
    { question: 'Can I calculate /30 or /31 subnets?', answer: 'Yes. /30 gives 2 usable hosts (for point-to-point links). /31 allows 2 hosts with no network/broadcast (RFC 3021).' },
];

function ResultRow({ label, value, mono = false }: { label: string; value: string | number; mono?: boolean }) {
    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{label}</span>
            <span style={{ fontFamily: mono ? 'monospace' : 'inherit', fontWeight: 600, color: 'var(--text-primary)' }}>{value}</span>
        </div>
    );
}

function SubnetInner() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [input, setInput] = useState(searchParams.get('cidr') ? safeDecodeURI(searchParams.get('cidr')!) : '');
    const [result, setResult] = useState<SubnetInfo | null>(null);
    const [error, setError] = useState('');

    const calculate = (cidr: string) => {
        if (!cidr.trim()) { setResult(null); setError(''); return; }
        try {
            const r = calculateSubnet(cidr);
            setResult(r);
            setError('');
            router.replace(`/subnet-calculator?cidr=${encodeURIComponent(cidr)}`, { scroll: false });
        } catch (e) {
            setError((e as Error).message);
            setResult(null);
        }
    };

    return (
        <ToolLayout
            title="Subnet Calculator"
            description="Enter an IP address in CIDR notation (e.g. 192.168.1.0/24) and instantly see network address, broadcast, host range, subnet mask, and usable host count."
            badge="Network"
            guideHref="/subnet-guide"
            faqs={FAQS}
        >
            <div className="glow-card p-5 flex flex-col gap-4">
                <InputBox
                    id="cidr-input"
                    label="IP Address / CIDR"
                    value={input}
                    onChange={setInput}
                    placeholder="192.168.1.0/24"
                    example="10.0.0.0/8"
                    type="input"
                    monospace
                />
                <button id="calculate-btn" className="btn-primary" onClick={() => calculate(input)}>
                    <Zap size={15} /> Calculate
                </button>

                {error && (
                    <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '8px', padding: '12px', color: '#ef4444', fontSize: '0.85rem' }}>
                        ⚠️ {error}
                    </div>
                )}

                {result && (
                    <div className="fade-in">
                        <ResultRow label="Network Address" value={result.networkAddress} mono />
                        <ResultRow label="Broadcast Address" value={result.broadcastAddress} mono />
                        <ResultRow label="First Usable Host" value={result.firstHost} mono />
                        <ResultRow label="Last Usable Host" value={result.lastHost} mono />
                        <ResultRow label="Subnet Mask" value={result.subnetMask} mono />
                        <ResultRow label="Wildcard Mask" value={result.wildcardMask} mono />
                        <ResultRow label="CIDR Prefix" value={`/${result.cidr}`} mono />
                        <ResultRow label="Total Addresses" value={result.totalHosts.toLocaleString()} />
                        <ResultRow label="Usable Hosts" value={result.usableHosts.toLocaleString()} />
                        <ResultRow label="IP Class" value={result.ipClass} />

                        {/* Binary mask */}
                        <div style={{ marginTop: '12px' }}>
                            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '6px' }}>Binary Subnet Mask</div>
                            <div className="output-block" style={{ fontSize: '0.8rem', letterSpacing: '0.04em' }}>{result.binaryMask}</div>
                        </div>
                    </div>
                )}
            </div>

            {/* Quick reference */}
            <div>
                <h2 className="text-lg font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>Common CIDR Ranges</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '10px' }}>
                    {[
                        { cidr: '10.0.0.0/8', hosts: '16.7M' },
                        { cidr: '172.16.0.0/12', hosts: '1.04M' },
                        { cidr: '192.168.0.0/16', hosts: '65,534' },
                        { cidr: '192.168.1.0/24', hosts: '254' },
                        { cidr: '192.168.1.0/28', hosts: '14' },
                        { cidr: '10.0.0.0/30', hosts: '2' },
                    ].map(({ cidr, hosts }) => (
                        <button
                            key={cidr}
                            onClick={() => { setInput(cidr); calculate(cidr); }}
                            className="glow-card"
                            style={{ padding: '10px', cursor: 'pointer', background: 'var(--bg-card)', border: '1px solid var(--border)', textAlign: 'left' }}
                        >
                            <div style={{ fontFamily: 'monospace', fontWeight: 700, color: 'var(--accent)', fontSize: '0.85rem' }}>{cidr}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>{hosts} hosts</div>
                        </button>
                    ))}
                </div>
            </div>
        </ToolLayout>
    );
}

export default function SubnetPage() {
    return <Suspense><SubnetInner /></Suspense>;
}
