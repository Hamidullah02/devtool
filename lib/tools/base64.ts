// Base64 encode/decode utility

export function base64Encode(input: string, urlSafe = false): string {
    const encoded = btoa(unescape(encodeURIComponent(input)));
    return urlSafe ? encoded.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '') : encoded;
}

export function base64Decode(input: string, urlSafe = false): string {
    try {
        let str = input;
        if (urlSafe) {
            str = str.replace(/-/g, '+').replace(/_/g, '/');
            while (str.length % 4 !== 0) str += '=';
        }
        return decodeURIComponent(escape(atob(str)));
    } catch {
        throw new Error('Invalid Base64 string. Please check the input.');
    }
}

export function detectBase64(input: string): boolean {
    try {
        atob(input.replace(/-/g, '+').replace(/_/g, '/'));
        return true;
    } catch {
        return false;
    }
}
