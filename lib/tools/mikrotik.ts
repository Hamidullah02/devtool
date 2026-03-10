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

export interface MikrotikRuleEntry {
    label: string;
    slug: string;
    description: string;
    longDescription: string;
    useCases: string[];
    warning?: string;
    rule: FirewallRule;
    relatedSlugs?: string[];
}

export const MIKROTIK_RULES: MikrotikRuleEntry[] = [
    {
        label: 'Drop Invalid Connections',
        slug: 'drop-invalid-connections',
        description: 'Block all traffic with invalid connection state. Essential for any MikroTik router.',
        longDescription: 'Invalid connection-state packets are packets that do not belong to any known connection. These are often the result of port scans, spoofed packets, or network reconnaissance. Dropping them immediately protects your router from a wide class of attacks and is considered a RouterOS security baseline. This rule should be placed near the top of your firewall filter list.',
        useCases: [
            'First rule on any production MikroTik router',
            'Protects against fragmentation attacks and spoofed TCP resets',
            'Reduces CPU load by discarding noise traffic early',
        ],
        warning: 'Place this above all other rules. Invalid packets have no legitimate use.',
        rule: { chain: 'input', action: 'drop', connectionState: ['invalid'], comment: 'Drop invalid' },
        relatedSlugs: ['allow-established-connections', 'drop-port-scanners', 'log-dropped-traffic'],
    },
    {
        label: 'Allow Established and Related Connections',
        slug: 'allow-established-connections',
        description: 'Accept return traffic for already-established sessions — the most critical allow rule.',
        longDescription: 'After your router or a client initiates a connection, the responses must be allowed back in. Without this rule, all return traffic would be dropped, making the internet unusable. The "established" state covers packets belonging to a tracked connection, and "related" covers helper connections (like FTP data channels). This rule must come before any DROP rules that might block return traffic.',
        useCases: [
            'Required for all outbound-initiated connections to receive responses',
            'Allows FTP passive mode and SIP RTP streams via connection tracking',
            'Reduces stateful firewall processing by fast-pathing known connections',
        ],
        rule: { chain: 'input', action: 'accept', connectionState: ['established', 'related'], comment: 'Allow established' },
        relatedSlugs: ['drop-invalid-connections', 'allow-dns-queries', 'allow-icmp-ping'],
    },
    {
        label: 'Block SSH Brute Force',
        slug: 'block-ssh-brute-force',
        description: 'Drop repeated SSH login attempts from the same IP to prevent credential stuffing.',
        longDescription: 'SSH (port 22) is the most attacked port on any internet-facing router. Bots continuously try username/password combinations in automated "brute force" attacks. This rule drops connections to port 22, protecting your router login while you manage it via Winbox or by restricting SSH to a trusted source IP. For production environments, consider combining this with an address-list rate limiter.',
        useCases: [
            'Prevent automated username/password attacks on RouterOS SSH',
            'Reduce CPU load from connection state tracking on port 22',
            'Force admin access via Winbox (port 8291) instead of open SSH',
        ],
        warning: 'If you apply this rule without another way to manage the router, you may lock yourself out. Have a console/serial backup.',
        rule: { chain: 'input', action: 'drop', protocol: 'tcp', dstPort: '22', comment: 'Block SSH brute force' },
        relatedSlugs: ['allow-winbox-management', 'drop-invalid-connections', 'block-telnet-access'],
    },
    {
        label: 'Allow Winbox Management',
        slug: 'allow-winbox-management',
        description: 'Permit MikroTik Winbox GUI connections on TCP port 8291.',
        longDescription: 'Winbox is the proprietary MikroTik graphical management client. It uses TCP port 8291 and provides a full RouterOS management interface. Unlike SSH, Winbox uses a MikroTik-specific binary protocol that is harder to brute-force. This rule explicitly allows Winbox while you can safely block SSH. For maximum security, restrict src-address to your management network IP range.',
        useCases: [
            'Allow remote management via the Winbox GUI application',
            'Safer alternative to keeping SSH open on internet-facing routers',
            'Combine with src-address restriction for locked-down management access',
        ],
        rule: { chain: 'input', action: 'accept', protocol: 'tcp', dstPort: '8291', comment: 'Allow Winbox' },
        relatedSlugs: ['block-ssh-brute-force', 'block-telnet-access', 'allow-established-connections'],
    },
    {
        label: 'Block Telnet Access',
        slug: 'block-telnet-access',
        description: 'Drop all Telnet connections (port 23). Telnet is unencrypted and must never be exposed.',
        longDescription: 'Telnet (TCP port 23) transmits all data including passwords in plain text. Any observer between you and the router can capture your credentials. RouterOS still has Telnet enabled by default on many firmware versions. This rule hard-drops all Telnet traffic. You should also disable the Telnet service in /ip service, but the firewall rule is a defense-in-depth layer.',
        useCases: [
            'Block legacy Telnet exposure on internet-facing MikroTik interfaces',
            'Compliance requirement for PCI-DSS and ISO 27001 environments',
            'Defense-in-depth when Telnet service cannot be immediately disabled',
        ],
        warning: 'Telnet should also be disabled at /ip service. The firewall blocks it at the network level.',
        rule: { chain: 'input', action: 'drop', protocol: 'tcp', dstPort: '23', comment: 'Block Telnet' },
        relatedSlugs: ['block-ssh-brute-force', 'allow-winbox-management', 'drop-invalid-connections'],
    },
    {
        label: 'Allow DNS Queries',
        slug: 'allow-dns-queries',
        description: 'Permit DNS queries on UDP port 53 to enable name resolution for clients.',
        longDescription: 'If your MikroTik router is acting as a DNS server for local clients (using /ip dns), you need to allow UDP port 53 in the input chain. Without this rule, all DNS queries from LAN clients will be dropped at the firewall. Note: if you do not want your router to be an open DNS resolver, add a src-address restriction to limit it to your LAN subnet (e.g. 192.168.1.0/24).',
        useCases: [
            'Enable DNS forwarding for LAN clients via the router',
            'Required when using MikroTik as a local DNS cache server',
            'Allows split-horizon DNS for corporate VPN setups',
        ],
        warning: 'Add src-address=192.168.1.0/24 to prevent your router from being an open DNS resolver on WAN.',
        rule: { chain: 'input', action: 'accept', protocol: 'udp', dstPort: '53', comment: 'Allow DNS' },
        relatedSlugs: ['allow-established-connections', 'allow-icmp-ping', 'allow-ntp-sync'],
    },
    {
        label: 'Allow ICMP Ping',
        slug: 'allow-icmp-ping',
        description: 'Accept ICMP echo requests so the router responds to ping diagnostics.',
        longDescription: 'ICMP ping (echo-request, type 8) is essential for network diagnostics and monitoring. By default, if you have a default-deny firewall, pings will be silently dropped. This rule allows ICMP so tools like ping, mtr, and traceroute work correctly. On internet-facing interfaces, you may want to rate-limit ICMP to prevent ICMP flood attacks using MikroTik connection-limit or a /ip firewall filter count matcher.',
        useCases: [
            'Allow network engineers to ping the router for connectivity testing',
            'Required for monitoring systems (Zabbix, PRTG, LibreNMS) to check uptime',
            'Enables traceroute to show the router as a hop in path tracing',
        ],
        rule: { chain: 'input', action: 'accept', protocol: 'icmp', comment: 'Allow ICMP ping' },
        relatedSlugs: ['allow-established-connections', 'block-port-scanning', 'allow-dns-queries'],
    },
    {
        label: 'Block Port Scanning',
        slug: 'block-port-scanning',
        description: 'Detect and block IPs that are scanning your router ports using RouterOS address lists.',
        longDescription: 'Port scanners (like nmap) probe many ports quickly to discover open services. MikroTik RouterOS can detect and automatically blacklist port scanner IPs using address lists and firewall matchers. This two-rule approach: first adds the scanning IP to a dynamic blacklist, then drops all connections from that blacklist. The address list entry expires after a configurable timeout (e.g., 1 day).',
        useCases: [
            'Automatically blacklist IPs running nmap or masscan against your WAN',
            'ISP networks using MikroTik to protect customer CPE from external probing',
            'Honeypot detection — block any IP that connects to a non-existent port',
        ],
        rule: { chain: 'input', action: 'drop', protocol: 'tcp', comment: 'Block port scanners' },
        relatedSlugs: ['drop-invalid-connections', 'block-ssh-brute-force', 'log-dropped-traffic'],
    },
    {
        label: 'Allow NTP Time Sync',
        slug: 'allow-ntp-sync',
        description: 'Permit outbound NTP (UDP 123) so the router can synchronize its system clock.',
        longDescription: 'Network Time Protocol (NTP) keeps the router\'s clock accurate, which is critical for logging timestamps, certificate validation, VPN key exchange (IKE), and scheduled scripts. RouterOS uses /system ntp client to sync. This rule allows outbound UDP on port 123 in the output chain. Without accurate time, logs become useless for forensics and some VPN protocols will fail to authenticate.',
        useCases: [
            'Ensure accurate log timestamps for security incident investigation',
            'Required for IPSec/IKEv2 VPN — clock skew > 5 minutes breaks authentication',
            'Prevents certificate validation errors in HTTPS and Let\'s Encrypt renewals',
        ],
        rule: { chain: 'output', action: 'accept', protocol: 'udp', dstPort: '123', comment: 'Allow NTP' },
        relatedSlugs: ['allow-dns-queries', 'allow-established-connections', 'allow-icmp-ping'],
    },
    {
        label: 'Drop All Traffic to WAN Input (Default Deny)',
        slug: 'default-deny-wan-input',
        description: 'Block all uninitiated inbound connections from WAN — the final hardening rule.',
        longDescription: 'A "default deny" rule at the end of the input chain drops everything not explicitly allowed by previous rules. This is the cornerstone of a least-privilege firewall. The key to using this correctly is ordering: place all ACCEPT rules above this rule. Traffic that matches an ACCEPT rule passes through. Traffic that falls through to this rule is dropped. This prevents new, unexpected services from being accidentally exposed.',
        useCases: [
            'Final rule in any hardened MikroTik input chain',
            'Ensures new RouterOS services added in future firmware don\'t auto-expose',
            'Reduces attack surface for zero-day vulnerabilities in RouterOS services',
        ],
        warning: 'This rule MUST be placed last in the input chain. Put all your ACCEPT rules before it or you will lock yourself out.',
        rule: { chain: 'input', action: 'drop', inInterface: 'ether1', comment: 'Default deny WAN input' },
        relatedSlugs: ['drop-invalid-connections', 'allow-established-connections', 'allow-winbox-management'],
    },
    {
        label: 'Allow HTTP and HTTPS Forwarding',
        slug: 'allow-http-https-forward',
        description: 'Permit LAN clients to access web traffic (ports 80 and 443) through the router.',
        longDescription: 'For a MikroTik acting as a network gateway, the forward chain handles traffic passing through the router between interfaces. This rule accepts TCP connections on ports 80 (HTTP) and 443 (HTTPS) from LAN to WAN, enabling web browsing for clients. In most setups, you also need a matching Masquerade NAT rule in /ip firewall nat for internet access.',
        useCases: [
            'Allow web browsing for LAN users on a MikroTik gateway router',
            'ISP home router setup allowing customer HTTP/HTTPS access',
            'After enabling default-deny forward chain, explicitly re-allow web traffic',
        ],
        rule: { chain: 'forward', action: 'accept', protocol: 'tcp', dstPort: '80,443', comment: 'Allow HTTP/HTTPS forward' },
        relatedSlugs: ['allow-established-connections', 'allow-dns-queries', 'default-deny-wan-input'],
    },
    {
        label: 'Block Access to Router from WAN on Sensitive Ports',
        slug: 'block-wan-management-ports',
        description: 'Drop management access (SSH, Winbox, HTTP API, FTP) from untrusted WAN interface.',
        longDescription: 'RouterOS exposes multiple management services by default: SSH (22), Telnet (23), HTTP (80), HTTPS (443), API (8728), API-SSL (8729), Winbox (8291), FTP (21). While you may need Winbox from specific IPs, all of these must be blocked from the untrusted WAN interface. This compound rule uses a destination port list to block all common management ports in a single rule, keeping your rule list clean.',
        useCases: [
            'ISP technicians hardening customer CPE before field deployment',
            'Preventing botnet reconnaissance of RouterOS management interfaces',
            'Satisfying firewall audit requirements that prohibit open management from WAN',
        ],
        warning: 'Ensure you have an out-of-band access path (console cable, another interface) before applying this rule.',
        rule: { chain: 'input', action: 'drop', protocol: 'tcp', dstPort: '21,22,23,80,443,8291,8728,8729', inInterface: 'ether1', comment: 'Block WAN management access' },
        relatedSlugs: ['allow-winbox-management', 'block-telnet-access', 'default-deny-wan-input'],
    },
    {
        label: 'Log Dropped Traffic',
        slug: 'log-dropped-traffic',
        description: 'Log all traffic that would be dropped, for security monitoring and forensics.',
        longDescription: 'Before a final DROP rule, inserting a LOG rule captures details of blocked traffic (source IP, destination, protocol, port). These logs appear in /log print and can be forwarded to a remote syslog server. This is critical for security incident investigation and capacity planning. Use a log-prefix to make filtering easy in syslog. Be aware that high-volume attacks can flood the log; add rate-limit matchers if log noise is a problem.',
        useCases: [
            'Feed MikroTik firewall drop events into a central SIEM (Splunk, Graylog)',
            'Identify which IPs are repeatedly attacking your router',
            'Debug "why is traffic getting blocked" by checking log entries',
        ],
        rule: { chain: 'input', action: 'log', log: true, logPrefix: 'DROP-INPUT', comment: 'Log dropped traffic' },
        relatedSlugs: ['default-deny-wan-input', 'drop-invalid-connections', 'block-port-scanning'],
    },
    {
        label: 'Allow OSPF Routing Protocol',
        slug: 'allow-ospf-routing',
        description: 'Accept OSPF packets so the MikroTik can participate in dynamic routing.',
        longDescription: 'OSPF (Open Shortest Path First) is a link-state routing protocol used in enterprise and ISP networks. RouterOS supports OSPF via /routing ospf. For OSPF to work, the router must be able to send and receive OSPF Hello packets to form neighbor relationships. OSPF uses IP protocol 89 (not TCP or UDP). This rule allows it in the input chain on the interface facing the OSPF network.',
        useCases: [
            'ISP networks using OSPF for dynamic internal routing between MikroTik routers',
            'Enterprise BGP edge routers redistributing OSPF from internal network',
            'MPLS L3VPN deployments using OSPF as the PE-CE protocol',
        ],
        rule: { chain: 'input', action: 'accept', protocol: 'ospf', comment: 'Allow OSPF' },
        relatedSlugs: ['allow-established-connections', 'allow-icmp-ping', 'allow-ntp-sync'],
    },
    {
        label: 'Block Bogon IP Addresses',
        slug: 'block-bogon-addresses',
        description: 'Drop traffic from private/reserved IP ranges arriving on the WAN interface.',
        longDescription: 'Bogon IP addresses are IP ranges that should never appear as source addresses on the public internet. These include RFC 1918 private ranges (10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16), loopback (127.0.0.0/8), and other reserved ranges. If your WAN interface receives traffic with these source addresses, it is either spoofed or misconfigured. Dropping bogons stops IP spoofing attacks that try to bypass IP-based access control.',
        useCases: [
            'Prevent IP spoofing attacks that fake a src-address from your LAN range',
            'Block misconfigured or malicious traffic from CGNAT or tunneling errors',
            'ISP edge routers performing strict uRPF-equivalent validation via firewall',
        ],
        rule: { chain: 'input', action: 'drop', srcAddress: '10.0.0.0/8', inInterface: 'ether1', comment: 'Block bogon src from WAN' },
        relatedSlugs: ['drop-invalid-connections', 'default-deny-wan-input', 'block-port-scanning'],
    },
];

// Keep backward-compatible MIKROTIK_TEMPLATES alias
export const MIKROTIK_TEMPLATES = MIKROTIK_RULES.map((r) => ({
    label: r.label,
    description: r.description,
    rule: r.rule,
}));
