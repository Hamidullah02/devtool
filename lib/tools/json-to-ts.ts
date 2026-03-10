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

export const JSON_EXAMPLES: { title: string; slug: string; description: string; json: string }[] = [
    {
        title: 'User profile object',
        slug: 'user-profile',
        description: 'A typical user object returned by an authentication API.',
        json: JSON.stringify({ id: 1, name: 'Alice Johnson', email: 'alice@example.com', role: 'admin', active: true, createdAt: '2024-01-15T10:30:00Z' }, null, 2),
    },
    {
        title: 'API paginated response',
        slug: 'paginated-api-response',
        description: 'Common REST API list response with pagination metadata.',
        json: JSON.stringify({ data: [{ id: 1, title: 'Item One', status: 'active' }], total: 100, page: 1, pageSize: 10, hasMore: true }, null, 2),
    },
    {
        title: 'E-commerce product',
        slug: 'ecommerce-product',
        description: 'Product object from a typical e-commerce or Shopify API.',
        json: JSON.stringify({ id: 'prod_123', name: 'Wireless Headphones', price: 79.99, currency: 'USD', inStock: true, tags: ['audio', 'wireless'], variants: [{ sku: 'WH-BLACK', color: 'Black' }] }, null, 2),
    },
    {
        title: 'Blog post with author',
        slug: 'blog-post',
        description: 'CMS blog post object with nested author and metadata.',
        json: JSON.stringify({ slug: 'my-first-post', title: 'Hello World', body: 'Lorem ipsum...', publishedAt: '2024-03-01', author: { id: 5, name: 'Bob', avatar: 'https://example.com/bob.jpg' }, tags: ['intro', 'news'] }, null, 2),
    },
    {
        title: 'GitHub repository',
        slug: 'github-repository',
        description: 'Simplified GitHub API repository object.',
        json: JSON.stringify({ id: 123456, name: 'my-project', fullName: 'user/my-project', private: false, stargazersCount: 142, forksCount: 23, language: 'TypeScript', topics: ['nextjs', 'seo'] }, null, 2),
    },
    {
        title: 'Stripe payment intent',
        slug: 'stripe-payment-intent',
        description: 'Stripe PaymentIntent API object structure.',
        json: JSON.stringify({ id: 'pi_3ABC123', object: 'payment_intent', amount: 2000, currency: 'usd', status: 'succeeded', customerId: 'cus_XYZ', metadata: { orderId: 'ORD-001' } }, null, 2),
    },
    {
        title: 'Weather API response',
        slug: 'weather-api-response',
        description: 'OpenWeatherMap-style weather API response.',
        json: JSON.stringify({ city: 'London', country: 'GB', temp: 15.3, feelsLike: 13.1, humidity: 78, wind: { speed: 5.2, direction: 'NW' }, conditions: [{ main: 'Clouds', description: 'overcast clouds' }] }, null, 2),
    },
    {
        title: 'JWT decoded payload',
        slug: 'jwt-payload',
        description: 'Decoded JWT access token payload with standard claims.',
        json: JSON.stringify({ sub: 'user_42', iss: 'https://auth.example.com', aud: 'my-api', iat: 1710000000, exp: 1710003600, roles: ['admin', 'editor'], email: 'user@example.com' }, null, 2),
    },
    {
        title: 'Config file',
        slug: 'config-file',
        description: 'Application configuration JSON with nested settings.',
        json: JSON.stringify({ app: { name: 'MyApp', version: '1.0.0', debug: false }, server: { host: 'localhost', port: 3000 }, database: { url: 'postgres://localhost/mydb', poolSize: 10 } }, null, 2),
    },
    {
        title: 'Error response',
        slug: 'api-error-response',
        description: 'Standard API error object returned on 4xx/5xx responses.',
        json: JSON.stringify({ error: true, code: 'VALIDATION_FAILED', message: 'Invalid input data', details: [{ field: 'email', issue: 'Must be a valid email address' }], requestId: 'req_abc123' }, null, 2),
    },
];

