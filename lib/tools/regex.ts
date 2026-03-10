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
    { title: 'Email Validation', description: 'Validates standard email addresses', pattern: '^[\\w.-]+@[\\w.-]+\\.[a-zA-Z]{2,}$', slug: 'email-validation' },
    { title: 'Password Strength', description: 'Min 8 chars, uppercase, lowercase, digit, symbol', pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&]).{8,}$', slug: 'password-validation' },
    { title: 'Phone Number (US)', description: 'US phone formats: (123) 456-7890', pattern: '^\\+?1?[\\s.-]?\\(?\\d{3}\\)?[\\s.-]?\\d{3}[\\s.-]?\\d{4}$', slug: 'phone-number' },
    { title: 'IPv4 Address', description: 'Validates IPv4 dotted-decimal notation', pattern: '^(\\d{1,3}\\.){3}\\d{1,3}$', slug: 'ipv4-address' },
    { title: 'URL', description: 'HTTP/HTTPS URL matcher', pattern: 'https?:\\/\\/[\\w\\-]+(\\.[\\w\\-]+)+[/#?]?.*$', slug: 'url-match' },
    { title: 'Hex Color', description: 'CSS hex color codes #fff or #ffffff', pattern: '^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$', slug: 'hex-color' },
    { title: 'Date (YYYY-MM-DD)', description: 'ISO date format', pattern: '^\\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\\d|3[01])$', slug: 'date-iso' },
    { title: 'Slug (URL-safe)', description: 'Lowercase letters, digits, hyphens', pattern: '^[a-z0-9]+(?:-[a-z0-9]+)*$', slug: 'url-slug' },
];
