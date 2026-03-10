'use client';

import { useState } from 'react';
import ToolLayout from '@/components/ToolLayout';
import OutputBox from '@/components/OutputBox';
import ExampleCard from '@/components/ExampleCard';
import { generateFirewallRule, FirewallRule, MIKROTIK_RULES } from '@/lib/tools/mikrotik';
import { Zap } from 'lucide-react';

const FAQS = [
    { question: 'What is /ip firewall filter?', answer: 'RouterOS firewall filter controls incoming, forwarding, and outgoing traffic on a MikroTik router. Each rule matches traffic and performs an action (accept, drop, reject, log).' },
    { question: 'What is the chain?', answer: 'The chain determines when the rule is applied. "input" = traffic to the router itself. "forward" = traffic passing through. "output" = traffic originating from the router.' },
    { question: 'What is connection-state?', answer: 'Connection state tracks the lifecycle of a connection. Common values: new, established, related, invalid. Best practice: drop invalid, accept established/related.' },
    { question: 'How do I apply the generated rule?', answer: 'Paste the command into MikroTik terminal (SSH or Winbox terminal) and press Enter. The rule is added immediately. Verify with: /ip firewall filter print.' },
];

const FIELD_STYLE = { fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' };

export default function MikrotikPage() {
    const [rule, setRule] = useState<FirewallRule>({ chain: 'input', action: 'drop' });
    const [output, setOutput] = useState('');

    const update = (field: keyof FirewallRule, value: string | boolean | string[]) => {
        setRule((r) => ({ ...r, [field]: value }));
    };

    const generate = () => {
        setOutput(generateFirewallRule(rule));
    };

    const loadTemplate = (tmpl: FirewallRule) => {
        setRule(tmpl);
        setOutput(generateFirewallRule(tmpl));
    };

    const INPUT = ({ label, field, placeholder = '' }: { label: string; field: keyof FirewallRule; placeholder?: string }) => (
        <div>
            <label style={FIELD_STYLE}>{label}</label>
            <input
                className="input-field"
                style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}
                placeholder={placeholder}
                value={String(rule[field] || '')}
                onChange={(e) => update(field, e.target.value)}
            />
        </div>
    );

    const SELECT = ({ label, field, options }: { label: string; field: keyof FirewallRule; options: string[] }) => (
        <div>
            <label style={FIELD_STYLE}>{label}</label>
            <select
                className="input-field"
                style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}
                value={String(rule[field] || '')}
                onChange={(e) => update(field, e.target.value)}
            >
                {options.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
        </div>
    );

    return (
        <ToolLayout
            title="MikroTik Firewall Rule Generator"
            description="Generate RouterOS /ip firewall filter rules from a simple form. Copy and paste directly into your MikroTik terminal or Winbox."
            badge="MikroTik"
            faqs={FAQS}
        >
            {/* Form */}
            <div className="glow-card p-5 flex flex-col gap-4">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem' }}>
                    <SELECT label="Chain" field="chain" options={['input', 'forward', 'output']} />
                    <SELECT label="Action" field="action" options={['accept', 'drop', 'reject', 'log', 'passthrough', 'tarpit']} />
                    <SELECT label="Protocol" field="protocol" options={['', 'tcp', 'udp', 'icmp', 'icmpv6', 'gre', 'ospf']} />
                    <INPUT label="Source Address / Range" field="srcAddress" placeholder="192.168.1.0/24" />
                    <INPUT label="Destination Address" field="dstAddress" placeholder="10.0.0.0/8" />
                    <INPUT label="Source Port" field="srcPort" placeholder="1024-65535" />
                    <INPUT label="Destination Port" field="dstPort" placeholder="22, 80, 443" />
                    <INPUT label="In Interface" field="inInterface" placeholder="ether1" />
                    <INPUT label="Out Interface" field="outInterface" placeholder="ether2" />
                    <INPUT label="Comment" field="comment" placeholder="Block SSH" />
                </div>

                {/* Connection state checkboxes */}
                <div>
                    <label style={{ ...FIELD_STYLE, marginBottom: '8px' }}>Connection State</label>
                    <div className="flex gap-4 flex-wrap">
                        {['new', 'established', 'related', 'invalid'].map((state) => (
                            <label key={state} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                                <input
                                    type="checkbox"
                                    checked={(rule.connectionState || []).includes(state)}
                                    onChange={(e) => {
                                        const states = rule.connectionState || [];
                                        update('connectionState', e.target.checked ? [...states, state] : states.filter((s) => s !== state));
                                    }}
                                />
                                {state}
                            </label>
                        ))}
                    </div>
                </div>

                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                    <input type="checkbox" checked={rule.log || false} onChange={(e) => update('log', e.target.checked)} />
                    Enable logging
                </label>

                <button id="generate-btn" className="btn-primary" onClick={generate}>
                    <Zap size={15} /> Generate Rule
                </button>

                <OutputBox label="RouterOS Command" value={output} language="routeros" minHeight="100px" />
            </div>

            {/* Templates */}
            <div>
                <h2 className="text-lg font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>Security Rule Templates</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem' }}>
                    {MIKROTIK_RULES.map((tmpl) => (
                        <ExampleCard
                            key={tmpl.label}
                            title={tmpl.label}
                            description={tmpl.description}
                            expression={generateFirewallRule(tmpl.rule)}
                            language="routeros"
                            slug={`/mikrotik-firewall/${tmpl.slug}`}
                            toolHref={`/mikrotik-firewall/${tmpl.slug}`}
                        />
                    ))}
                </div>
            </div>
        </ToolLayout>
    );
}
