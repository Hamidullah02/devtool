// IPv6 address utilities

export interface IPv6Info {
    original: string;
    expanded: string;
    compressed: string;
    type: string;
    groups: string[];
}

function expandIPv6(addr: string): string {
    let expanded = addr;

    // Handle :: shorthand
    if (expanded.includes('::')) {
        const sides = expanded.split('::');
        const left = sides[0] ? sides[0].split(':') : [];
        const right = sides[1] ? sides[1].split(':') : [];
        const missing = 8 - left.length - right.length;
        const fill = Array(missing).fill('0000');
        expanded = [...left, ...fill, ...right].join(':');
    }

    // Pad each group to 4 hex digits
    return expanded.split(':').map((g) => g.padStart(4, '0')).join(':');
}

function compressIPv6(addr: string): string {
    const expanded = expandIPv6(addr);
    const groups = expanded.split(':');

    // Remove leading zeros
    const noLeading = groups.map((g) => g.replace(/^0+/, '') || '0');

    // Find longest run of zeros
    let bestStart = -1, bestLen = 0, curStart = -1, curLen = 0;
    for (let i = 0; i <= noLeading.length; i++) {
        if (i < noLeading.length && noLeading[i] === '0') {
            if (curStart === -1) { curStart = i; curLen = 0; }
            curLen++;
        } else {
            if (curLen > bestLen) { bestLen = curLen; bestStart = curStart; }
            curStart = -1; curLen = 0;
        }
    }

    if (bestLen > 1) {
        const before = noLeading.slice(0, bestStart).join(':');
        const after = noLeading.slice(bestStart + bestLen).join(':');
        return (before ? before + '::' : '::') + (after || '');
    }

    return noLeading.join(':');
}

function getIPv6Type(expanded: string): string {
    if (expanded.startsWith('0000:0000:0000:0000:0000:0000:0000:0001')) return 'Loopback (::1)';
    if (expanded.startsWith('0000:0000:0000:0000:0000:0000:0000:0000')) return 'Unspecified (::)';
    if (expanded.startsWith('fe80')) return 'Link-Local (fe80::/10)';
    if (expanded.startsWith('fc') || expanded.startsWith('fd')) return 'Unique Local (fc00::/7)';
    if (expanded.startsWith('ff')) return 'Multicast (ff00::/8)';
    if (expanded.startsWith('2001:0db8')) return 'Documentation (2001:db8::/32)';
    if (expanded.startsWith('2002')) return '6to4 Transition (2002::/16)';
    if (expanded.startsWith('0000:0000:0000:0000:0000:ffff')) return 'IPv4-Mapped (::ffff:0:0/96)';
    return 'Global Unicast';
}

export function analyzeIPv6(input: string): IPv6Info {
    const trimmed = input.trim().toLowerCase();

    // Basic validation
    if (!/^[0-9a-f:]+$/i.test(trimmed) && !trimmed.includes('::')) {
        throw new Error('Invalid IPv6 address format.');
    }

    const expanded = expandIPv6(trimmed);
    const groups = expanded.split(':');

    if (groups.length !== 8) {
        throw new Error('IPv6 address must have 8 groups.');
    }

    return {
        original: input.trim(),
        expanded,
        compressed: compressIPv6(expanded),
        type: getIPv6Type(expanded),
        groups,
    };
}
