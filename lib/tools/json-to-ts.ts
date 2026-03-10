// JSON to TypeScript interface converter

function getType(value: unknown, key: string, depth: number): string {
    if (value === null) return 'null';
    if (Array.isArray(value)) {
        if (value.length === 0) return 'unknown[]';
        const elementTypes = [...new Set(value.map((v) => getType(v, key, depth)))];
        const elementType = elementTypes.length === 1 ? elementTypes[0] : elementTypes.join(' | ');
        return `${elementType}[]`;
    }
    if (typeof value === 'object') {
        return buildInterface(value as Record<string, unknown>, key, depth + 1);
    }
    if (typeof value === 'number') return Number.isInteger(value) ? 'number' : 'number';
    return typeof value;
}

function toPascalCase(str: string): string {
    return str.replace(/(^\w|_\w|-\w|\s\w)/g, (m) => m.replace(/[_\-\s]/, '').toUpperCase());
}

function buildInterface(obj: Record<string, unknown>, name: string, depth: number): string {
    const indent = '  '.repeat(depth);
    const innerIndent = '  '.repeat(depth + 1);
    const interfaceName = toPascalCase(name || 'Root');

    const lines = Object.entries(obj).map(([key, value]) => {
        const safeKey = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key) ? key : `"${key}"`;
        const type = getType(value, key, depth);
        return `${innerIndent}${safeKey}: ${type};`;
    });

    return `{\n${lines.join('\n')}\n${indent}}`;
}

export function jsonToTypeScript(jsonStr: string): string {
    let parsed: unknown;
    try {
        parsed = JSON.parse(jsonStr);
    } catch (e) {
        throw new Error('Invalid JSON: ' + (e as Error).message);
    }

    if (typeof parsed !== 'object' || parsed === null) {
        throw new Error('Input must be a JSON object or array.');
    }

    if (Array.isArray(parsed)) {
        if (parsed.length === 0) return 'export type Root = unknown[];';
        const inner = buildInterface(parsed[0] as Record<string, unknown>, 'Root', 0);
        return `export interface Root ${inner}\n\nexport type RootList = Root[];`;
    }

    return `export interface Root ${buildInterface(parsed as Record<string, unknown>, 'Root', 0)}`;
}
