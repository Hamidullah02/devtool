// Subnet / CIDR calculator

export interface SubnetInfo {
    networkAddress: string;
    broadcastAddress: string;
    firstHost: string;
    lastHost: string;
    subnetMask: string;
    wildcardMask: string;
    totalHosts: number;
    usableHosts: number;
    cidr: number;
    ipClass: string;
    binaryMask: string;
}

function ipToInt(ip: string): number {
    return ip.split('.').reduce((acc, octet) => (acc << 8) | parseInt(octet, 10), 0) >>> 0;
}

function intToIp(n: number): string {
    return [(n >>> 24) & 255, (n >>> 16) & 255, (n >>> 8) & 255, n & 255].join('.');
}

function getClass(firstOctet: number): string {
    if (firstOctet <= 127) return 'A';
    if (firstOctet <= 191) return 'B';
    if (firstOctet <= 223) return 'C';
    if (firstOctet <= 239) return 'D (Multicast)';
    return 'E (Reserved)';
}

export function calculateSubnet(cidrNotation: string): SubnetInfo {
    const [ip, cidrStr] = cidrNotation.split('/');
    if (!ip || !cidrStr) throw new Error('Enter CIDR in format: 192.168.1.0/24');

    const cidr = parseInt(cidrStr, 10);
    if (isNaN(cidr) || cidr < 0 || cidr > 32) throw new Error('CIDR prefix must be 0–32');

    const octets = ip.split('.').map(Number);
    if (octets.length !== 4 || octets.some((o) => isNaN(o) || o < 0 || o > 255)) {
        throw new Error('Invalid IP address format');
    }

    const mask = cidr === 0 ? 0 : (~0 << (32 - cidr)) >>> 0;
    const ipInt = ipToInt(ip);
    const networkInt = (ipInt & mask) >>> 0;
    const broadcastInt = (networkInt | (~mask >>> 0)) >>> 0;
    const totalHosts = Math.pow(2, 32 - cidr);
    const usableHosts = cidr >= 31 ? totalHosts : Math.max(0, totalHosts - 2);

    const wildcardInt = (~mask) >>> 0;
    const binaryMask = mask.toString(2).padStart(32, '0').replace(/(.{8})/g, '$1.').slice(0, -1);

    return {
        networkAddress: intToIp(networkInt),
        broadcastAddress: intToIp(broadcastInt),
        firstHost: cidr >= 31 ? intToIp(networkInt) : intToIp(networkInt + 1),
        lastHost: cidr >= 31 ? intToIp(broadcastInt) : intToIp(broadcastInt - 1),
        subnetMask: intToIp(mask),
        wildcardMask: intToIp(wildcardInt),
        totalHosts,
        usableHosts,
        cidr,
        ipClass: getClass(octets[0]),
        binaryMask,
    };
}
