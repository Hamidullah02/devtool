// Cron expression builder and human-readable explainer

export interface CronParts {
    minute: string;
    hour: string;
    dayOfMonth: string;
    month: string;
    dayOfWeek: string;
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function explainField(value: string, unit: string, names?: string[]): string {
    if (value === '*') return `every ${unit}`;
    if (value.startsWith('*/')) return `every ${value.slice(2)} ${unit}s`;
    if (value.includes(',')) {
        const parts = value.split(',').map((v) => (names ? names[parseInt(v)] || v : v));
        return `at ${unit}s ${parts.join(', ')}`;
    }
    if (value.includes('-')) {
        const [from, to] = value.split('-');
        const f = names ? names[parseInt(from)] || from : from;
        const t = names ? names[parseInt(to)] || to : to;
        return `from ${unit} ${f} through ${t}`;
    }
    if (names && !isNaN(parseInt(value))) {
        return `on ${names[parseInt(value)] || value}`;
    }
    return `at ${unit} ${value}`;
}

export function buildCronExpression(parts: CronParts): string {
    return `${parts.minute} ${parts.hour} ${parts.dayOfMonth} ${parts.month} ${parts.dayOfWeek}`;
}

export function explainCron(expr: string): string {
    const parts = expr.trim().split(/\s+/);
    if (parts.length !== 5) return 'Invalid cron expression (must have 5 fields).';

    const [min, hour, dom, month, dow] = parts;
    const segments: string[] = [];

    segments.push(explainField(min, 'minute'));
    segments.push(explainField(hour, 'hour'));
    if (dom !== '*') segments.push(explainField(dom, 'day-of-month'));
    if (month !== '*') segments.push(explainField(month, 'month', MONTHS));
    if (dow !== '*') segments.push(explainField(dow, 'weekday', DAYS));

    return 'Runs ' + segments.join(', ') + '.';
}

export const CRON_EXAMPLES: { label: string; expr: string; slug: string; description: string }[] = [
    { label: 'Every minute', expr: '* * * * *', slug: 'every-minute', description: 'Runs once every minute, 24/7.' },
    { label: 'Every 5 minutes', expr: '*/5 * * * *', slug: 'every-5-minutes', description: 'Runs at minutes 0, 5, 10, 15...' },
    { label: 'Every 15 minutes', expr: '*/15 * * * *', slug: 'every-15-minutes', description: 'Runs four times per hour.' },
    { label: 'Every 30 minutes', expr: '*/30 * * * *', slug: 'every-30-minutes', description: 'Runs twice per hour.' },
    { label: 'Every hour', expr: '0 * * * *', slug: 'every-hour', description: 'Runs at the start of every hour.' },
    { label: 'Every 6 hours', expr: '0 */6 * * *', slug: 'every-6-hours', description: 'Runs at 0:00, 6:00, 12:00, 18:00.' },
    { label: 'Every 12 hours', expr: '0 */12 * * *', slug: 'every-12-hours', description: 'Runs at midnight and noon.' },
    { label: 'Every day at midnight', expr: '0 0 * * *', slug: 'every-day-midnight', description: 'Daily cleanup or backup trigger.' },
    { label: 'Every day at noon', expr: '0 12 * * *', slug: 'every-day-noon', description: 'Daily report or digest at 12:00.' },
    { label: 'Every Monday', expr: '0 9 * * 1', slug: 'every-monday', description: 'Weekly trigger every Monday at 9 AM.' },
    { label: 'Every weekday', expr: '0 9 * * 1-5', slug: 'every-weekday', description: 'Mon–Fri at 9 AM, skips weekends.' },
    { label: 'Every weekend', expr: '0 10 * * 0,6', slug: 'every-weekend', description: 'Saturday and Sunday at 10 AM.' },
    { label: 'First of each month', expr: '0 0 1 * *', slug: 'first-of-month', description: 'Monthly billing or report trigger.' },
    { label: 'Last step of month', expr: '0 0 28 * *', slug: 'every-28th', description: 'Runs on the 28th of every month.' },
    { label: 'Every January 1st', expr: '0 0 1 1 *', slug: 'every-january-1st', description: "New Year's Day tasks." },
    { label: 'Every Sunday night', expr: '0 23 * * 0', slug: 'every-sunday-night', description: 'Weekly maintenance window.' },
    { label: 'Every 2 hours', expr: '0 */2 * * *', slug: 'every-2-hours', description: 'Runs 12 times a day.' },
    { label: 'Twice daily', expr: '0 8,20 * * *', slug: 'twice-daily', description: 'Runs at 8 AM and 8 PM.' },
    { label: 'Every quarter', expr: '0 0 1 1,4,7,10 *', slug: 'every-quarter', description: 'Jan, Apr, Jul, Oct — quarterly jobs.' },
    { label: 'Every Friday at 5 PM', expr: '0 17 * * 5', slug: 'every-friday-5pm', description: 'End-of-week report trigger.' },
];
