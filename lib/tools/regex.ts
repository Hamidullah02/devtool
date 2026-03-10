// Regex token explainer

export interface RegexToken {
    raw: string;
    type: string;
    description: string;
    color: string;
}

const COLORS = {
    anchor: '#f59e0b',
    group: '#a78bfa',
    quantifier: '#34d399',
    charClass: '#60a5fa',
    special: '#f87171',
    literal: '#94a3b8',
    flag: '#fb923c',
    lookahead: '#e879f9',
};

export function tokenizeRegex(pattern: string): RegexToken[] {
    const tokens: RegexToken[] = [];
    let i = 0;
    const p = pattern.replace(/^\/|\/[gimsuy]*$/g, '');

    while (i < p.length) {
        const ch = p[i];

        if (ch === '\\' && i + 1 < p.length) {
            const next = p[i + 1];
            const escapes: Record<string, string> = {
                d: 'Digit [0-9]', D: 'Non-digit [^0-9]',
                w: 'Word char [a-zA-Z0-9_]', W: 'Non-word char',
                s: 'Whitespace', S: 'Non-whitespace',
                b: 'Word boundary', B: 'Non-word boundary',
                n: 'Newline', t: 'Tab', r: 'Carriage return',
                '.': 'Literal dot', '*': 'Literal asterisk',
                '+': 'Literal plus', '?': 'Literal question mark',
                '(': 'Literal open paren', ')': 'Literal close paren',
                '[': 'Literal open bracket', ']': 'Literal close bracket',
                '{': 'Literal open brace', '}': 'Literal close brace',
                '^': 'Literal caret', '$': 'Literal dollar',
                '|': 'Literal pipe', '/': 'Literal slash', '\\': 'Literal backslash',
            };
            tokens.push({
                raw: `\\${next}`,
                type: 'Special',
                description: escapes[next] || `Escaped character '${next}'`,
                color: COLORS.special,
            });
            i += 2;
            continue;
        }

        if (ch === '^' && i === 0) {
            tokens.push({ raw: '^', type: 'Anchor', description: 'Start of string', color: COLORS.anchor });
            i++; continue;
        }
        if (ch === '$' && i === p.length - 1) {
            tokens.push({ raw: '$', type: 'Anchor', description: 'End of string', color: COLORS.anchor });
            i++; continue;
        }

        if (ch === '(') {
            let groupLabel = 'Capturing group';
            let raw = '(';
            if (p[i + 1] === '?' && p[i + 2] === ':') { groupLabel = 'Non-capturing group'; raw = '(?:'; i += 3; }
            else if (p[i + 1] === '?' && p[i + 2] === '=') { groupLabel = 'Positive lookahead'; raw = '(?='; i += 3; }
            else if (p[i + 1] === '?' && p[i + 2] === '!') { groupLabel = 'Negative lookahead'; raw = '(?!'; i += 3; }
            else if (p[i + 1] === '?' && p[i + 2] === '<' && p[i + 3] === '=') { groupLabel = 'Positive lookbehind'; raw = '(?<='; i += 4; }
            else if (p[i + 1] === '?' && p[i + 2] === '<' && p[i + 3] === '!') { groupLabel = 'Negative lookbehind'; raw = '(?<!'; i += 4; }
            else i++;
            tokens.push({ raw, type: 'Group', description: groupLabel, color: COLORS.group });
            continue;
        }
        if (ch === ')') {
            tokens.push({ raw: ')', type: 'Group', description: 'End of group', color: COLORS.group });
            i++; continue;
        }

        if (ch === '[') {
            let j = i + 1;
            let charClass = '[';
            while (j < p.length && p[j] !== ']') {
                if (p[j] === '\\') { charClass += p[j] + p[j + 1]; j += 2; } else { charClass += p[j]; j++; }
            }
            charClass += ']';
            const negated = charClass[1] === '^';
            tokens.push({
                raw: charClass,
                type: 'Character Class',
                description: negated ? `Any character NOT in: ${charClass.slice(2, -1)}` : `Any character in: ${charClass.slice(1, -1)}`,
                color: COLORS.charClass,
            });
            i = j + 1; continue;
        }

        if (ch === '{') {
            const match = p.slice(i).match(/^\{(\d+)(,(\d*)?)?\}/);
            if (match) {
                const [full, min, , max] = match;
                let desc = `Exactly ${min} times`;
                if (max === undefined && match[2]) desc = `At least ${min} times`;
                else if (max !== undefined) desc = `Between ${min} and ${max} times`;
                tokens.push({ raw: full, type: 'Quantifier', description: desc, color: COLORS.quantifier });
                i += full.length; continue;
            }
        }

        const quantifiers: Record<string, string> = {
            '*': 'Zero or more (greedy)',
            '+': 'One or more (greedy)',
            '?': 'Zero or one (optional)',
        };
        if (quantifiers[ch]) {
            const lazy = p[i + 1] === '?';
            tokens.push({
                raw: lazy ? ch + '?' : ch,
                type: 'Quantifier',
                description: quantifiers[ch] + (lazy ? ' — lazy (minimal)' : ''),
                color: COLORS.quantifier,
            });
            i += lazy ? 2 : 1; continue;
        }

        if (ch === '.') {
            tokens.push({ raw: '.', type: 'Special', description: 'Any character except newline', color: COLORS.special });
            i++; continue;
        }
        if (ch === '|') {
            tokens.push({ raw: '|', type: 'Alternation', description: 'OR — match left or right side', color: COLORS.anchor });
            i++; continue;
        }

        tokens.push({ raw: ch, type: 'Literal', description: `Literal character '${ch}'`, color: COLORS.literal });
        i++;
    }

    return tokens;
}

export const REGEX_EXAMPLES: { title: string; description: string; pattern: string; slug: string }[] = [
    // — Identity & authentication —
    { title: 'Email Validation', description: 'Validates standard email addresses like user@example.com', pattern: '^[\\w.-]+@[\\w.-]+\\.[a-zA-Z]{2,}$', slug: 'email-validation' },
    { title: 'Password Strength', description: 'Min 8 chars, uppercase, lowercase, digit, special character', pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&]).{8,}$', slug: 'password-validation' },
    { title: 'Username', description: 'Alphanumeric, underscores, hyphens, 3–20 chars', pattern: '^[a-zA-Z0-9_-]{3,20}$', slug: 'username-validation' },

    // — Phone numbers —
    { title: 'Phone Number (US)', description: 'US phone formats: (123) 456-7890 or +1-123-456-7890', pattern: '^\\+?1?[\\s.-]?\\(?\\d{3}\\)?[\\s.-]?\\d{3}[\\s.-]?\\d{4}$', slug: 'phone-number' },
    { title: 'Phone Number (International)', description: 'E.164 international format: +441234567890', pattern: '^\\+[1-9]\\d{6,14}$', slug: 'phone-international' },

    // — Financial —
    { title: 'Credit Card Number', description: 'Validates 16-digit card numbers (Visa, Mastercard, Amex)', pattern: '^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|3[47][0-9]{13}|6(?:011|5[0-9]{2})[0-9]{12})$', slug: 'credit-card-validation' },
    { title: 'IBAN (International)', description: 'International Bank Account Number format', pattern: '^[A-Z]{2}\\d{2}[A-Z0-9]{1,30}$', slug: 'iban-validation' },
    { title: 'Currency Amount', description: 'Dollar amounts like $1,234.56 or 1234.56', pattern: '^\\$?\\d{1,3}(,\\d{3})*(\\.\\d{2})?$', slug: 'currency-amount' },

    // — Tax & business identifiers —
    { title: 'VAT Number (EU)', description: 'European VAT number formats (DE123456789, GB123456789)', pattern: '^(AT|BE|BG|CY|CZ|DE|DK|EE|ES|FI|FR|GB|GR|HR|HU|IE|IT|LT|LU|LV|MT|NL|PL|PT|RO|SE|SI|SK)[0-9A-Z]{2,13}$', slug: 'vat-number-eu' },
    { title: 'US EIN (Tax ID)', description: 'Employer Identification Number: 12-3456789', pattern: '^\\d{2}-\\d{7}$', slug: 'us-ein-validation' },

    // — Postal codes —
    { title: 'UK Postcode', description: 'British postcode formats: SW1A 1AA, EC1A 1BB', pattern: '^[A-Z]{1,2}\\d[A-Z\\d]?\\s*\\d[A-Z]{2}$', slug: 'uk-postcode' },
    { title: 'US ZIP Code', description: 'US ZIP code: 12345 or 12345-6789', pattern: '^\\d{5}(-\\d{4})?$', slug: 'us-zip-code' },
    { title: 'Canadian Postal Code', description: 'Canadian postal code: A1B 2C3', pattern: '^[A-Za-z]\\d[A-Za-z][ -]?\\d[A-Za-z]\\d$', slug: 'canadian-postal-code' },

    // — Network & identifiers —
    { title: 'IPv4 Address', description: 'Validates IPv4 dotted-decimal notation: 192.168.1.1', pattern: '^(\\d{1,3}\\.){3}\\d{1,3}$', slug: 'ipv4-address' },
    { title: 'IPv6 Address', description: 'Full or compressed IPv6 addresses', pattern: '^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$', slug: 'ipv6-address' },
    { title: 'MAC Address', description: 'Network MAC address: AA:BB:CC:DD:EE:FF', pattern: '^([0-9A-Fa-f]{2}[:-]){5}[0-9A-Fa-f]{2}$', slug: 'mac-address' },
    { title: 'UUID / GUID', description: 'Version 4 UUID: 550e8400-e29b-41d4-a716-446655440000', pattern: '^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$', slug: 'uuid-validation' },

    // — Web —
    { title: 'URL', description: 'HTTP/HTTPS URL matcher', pattern: 'https?:\\/\\/[\\w\\-]+(\\.[\\w\\-]+)+[/#?]?.*$', slug: 'url-match' },
    { title: 'Domain Name', description: 'Valid domain name: example.com or sub.example.co.uk', pattern: '^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\\.)+[a-zA-Z]{2,}$', slug: 'domain-name' },
    { title: 'Slug (URL-safe)', description: 'Lowercase letters, digits, hyphens: my-page-slug', pattern: '^[a-z0-9]+(?:-[a-z0-9]+)*$', slug: 'url-slug' },

    // — Date & time —
    { title: 'Date (YYYY-MM-DD)', description: 'ISO 8601 date: 2024-03-15', pattern: '^\\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\\d|3[01])$', slug: 'date-iso' },
    { title: 'Time (HH:MM)', description: '24-hour time format: 14:30', pattern: '^([01]\\d|2[0-3]):[0-5]\\d$', slug: 'time-24h' },

    // — Visual —
    { title: 'Hex Color', description: 'CSS hex color codes: #fff or #ffffff', pattern: '^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$', slug: 'hex-color' },

    // — Code —
    { title: 'Semantic Version', description: 'SemVer: 1.0.0, 2.3.1-alpha.1', pattern: '^(0|[1-9]\\d*)\\.(0|[1-9]\\d*)\\.(0|[1-9]\\d*)(?:-((?:0|[1-9]\\d*|\\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\\.(?:0|[1-9]\\d*|\\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?$', slug: 'semver-validation' },
    { title: 'JWT Token', description: 'JSON Web Token structure: three base64url segments', pattern: '^[A-Za-z0-9-_]+\\.[A-Za-z0-9-_]+\\.[A-Za-z0-9-_]*$', slug: 'jwt-token' },
];

