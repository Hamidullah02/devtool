// MikroTik RouterOS firewall rule generator

export interface FirewallRule {
    chain: string;
    action: string;
    protocol?: string;
    srcAddress?: string;
    dstAddress?: string;
    srcPort?: string;
    dstPort?: string;
    inInterface?: string;
    outInterface?: string;
    comment?: string;
    logPrefix?: string;
    log?: boolean;
    connectionState?: string[];
}

export function generateFirewallRule(rule: FirewallRule): string {
    const parts: string[] = ['/ip firewall filter add'];

    parts.push(`chain=${rule.chain}`);
    parts.push(`action=${rule.action}`);

    if (rule.protocol) parts.push(`protocol=${rule.protocol}`);
    if (rule.srcAddress) parts.push(`src-address=${rule.srcAddress}`);
    if (rule.dstAddress) parts.push(`dst-address=${rule.dstAddress}`);
    if (rule.srcPort) parts.push(`src-port=${rule.srcPort}`);
    if (rule.dstPort) parts.push(`dst-port=${rule.dstPort}`);
    if (rule.inInterface) parts.push(`in-interface=${rule.inInterface}`);
    if (rule.outInterface) parts.push(`out-interface=${rule.outInterface}`);
    if (rule.connectionState && rule.connectionState.length > 0) {
        parts.push(`connection-state=${rule.connectionState.join(',')}`);
    }
    if (rule.log) parts.push('log=yes');
    if (rule.logPrefix) parts.push(`log-prefix=${rule.logPrefix}`);
    if (rule.comment) parts.push(`comment="${rule.comment}"`);

    return parts.join(' \\\n  ');
}

export function generateRuleSet(rules: FirewallRule[]): string {
    return rules.map(generateFirewallRule).join('\n\n');
}

export const MIKROTIK_TEMPLATES: { label: string; description: string; rule: FirewallRule }[] = [
    {
        label: 'Drop Invalid Connections',
        description: 'Block all traffic with invalid connection state.',
        rule: { chain: 'input', action: 'drop', connectionState: ['invalid'], comment: 'Drop invalid' },
    },
    {
        label: 'Allow Established/Related',
        description: 'Accept traffic that is part of an established session.',
        rule: { chain: 'input', action: 'accept', connectionState: ['established', 'related'], comment: 'Allow established' },
    },
    {
        label: 'Block SSH Brute Force',
        description: 'Drop repeated SSH connections from same source.',
        rule: { chain: 'input', action: 'drop', protocol: 'tcp', dstPort: '22', comment: 'Block SSH brute force' },
    },
    {
        label: 'Allow Winbox',
        description: 'Allow MikroTik Winbox management port.',
        rule: { chain: 'input', action: 'accept', protocol: 'tcp', dstPort: '8291', comment: 'Allow Winbox' },
    },
    {
        label: 'Block Telnet',
        description: 'Drop all incoming Telnet connections.',
        rule: { chain: 'input', action: 'drop', protocol: 'tcp', dstPort: '23', comment: 'Block Telnet' },
    },
    {
        label: 'Allow DNS',
        description: 'Permit DNS queries on UDP port 53.',
        rule: { chain: 'input', action: 'accept', protocol: 'udp', dstPort: '53', comment: 'Allow DNS' },
    },
];
