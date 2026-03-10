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
    // — Every N minutes —
    { label: 'Every minute', expr: '* * * * *', slug: 'every-minute', description: 'Runs once every minute, 24/7. Highest frequency possible in standard cron.' },
    { label: 'Every 2 minutes', expr: '*/2 * * * *', slug: 'every-2-minutes', description: 'Runs 30 times per hour.' },
    { label: 'Every 5 minutes', expr: '*/5 * * * *', slug: 'every-5-minutes', description: 'Runs at minutes 0, 5, 10, 15... 12 times per hour.' },
    { label: 'Every 10 minutes', expr: '*/10 * * * *', slug: 'every-10-minutes', description: 'Runs 6 times per hour. Common for lightweight health checks.' },
    { label: 'Every 15 minutes', expr: '*/15 * * * *', slug: 'every-15-minutes', description: 'Runs four times per hour: 0, 15, 30, 45.' },
    { label: 'Every 20 minutes', expr: '*/20 * * * *', slug: 'every-20-minutes', description: 'Runs 3 times per hour: 0, 20, 40.' },
    { label: 'Every 30 minutes', expr: '*/30 * * * *', slug: 'every-30-minutes', description: 'Runs twice per hour at :00 and :30.' },
    { label: 'Every 45 minutes', expr: '*/45 * * * *', slug: 'every-45-minutes', description: 'Runs at minute 0 and 45 each hour.' },

    // — Hourly intervals —
    { label: 'Every hour', expr: '0 * * * *', slug: 'every-hour', description: 'Runs at the top of every hour, 24 times per day.' },
    { label: 'Every 2 hours', expr: '0 */2 * * *', slug: 'every-2-hours', description: 'Runs 12 times a day: 0:00, 2:00, 4:00...' },
    { label: 'Every 3 hours', expr: '0 */3 * * *', slug: 'every-3-hours', description: 'Runs 8 times daily. Good for digest aggregation.' },
    { label: 'Every 4 hours', expr: '0 */4 * * *', slug: 'every-4-hours', description: 'Runs 6 times a day: 0:00, 4:00, 8:00...' },
    { label: 'Every 6 hours', expr: '0 */6 * * *', slug: 'every-6-hours', description: 'Runs at 0:00, 6:00, 12:00, 18:00.' },
    { label: 'Every 8 hours', expr: '0 */8 * * *', slug: 'every-8-hours', description: 'Runs 3 times daily — shifts alignment.' },
    { label: 'Every 12 hours', expr: '0 */12 * * *', slug: 'every-12-hours', description: 'Runs at midnight and noon.' },

    // — Daily schedules —
    { label: 'Every day at midnight', expr: '0 0 * * *', slug: 'every-day-midnight', description: 'Daily cleanup or backup at 00:00.' },
    { label: 'Every day at 1 AM', expr: '0 1 * * *', slug: 'every-day-1am', description: 'Off-peak batch jobs, low-traffic period.' },
    { label: 'Every day at 2 AM', expr: '0 2 * * *', slug: 'every-day-2am', description: 'Database backup window. Most traffic is idle.' },
    { label: 'Every day at 3 AM', expr: '0 3 * * *', slug: 'every-day-3am', description: 'Log rotation and disk cleanup jobs.' },
    { label: 'Every day at 4 AM', expr: '0 4 * * *', slug: 'every-day-4am', description: 'Pre-dawn processing before business hours.' },
    { label: 'Every day at 6 AM', expr: '0 6 * * *', slug: 'every-day-6am', description: 'Morning report generation before users arrive.' },
    { label: 'Every day at 7 AM', expr: '0 7 * * *', slug: 'every-day-7am', description: 'Early morning digest emails.' },
    { label: 'Every day at 8 AM', expr: '0 8 * * *', slug: 'every-day-8am', description: 'Business hours start trigger.' },
    { label: 'Every day at 9 AM', expr: '0 9 * * *', slug: 'every-day-9am', description: 'Start-of-day data sync or standup reminders.' },
    { label: 'Every day at noon', expr: '0 12 * * *', slug: 'every-day-noon', description: 'Midday report or digest at 12:00.' },
    { label: 'Every day at 5 PM', expr: '0 17 * * *', slug: 'every-day-5pm', description: 'End-of-business-day report or export.' },
    { label: 'Every day at 6 PM', expr: '0 18 * * *', slug: 'every-day-6pm', description: 'Evening digest after business hours.' },
    { label: 'Every day at 10 PM', expr: '0 22 * * *', slug: 'every-day-10pm', description: 'Late-night maintenance window.' },
    { label: 'Twice daily', expr: '0 8,20 * * *', slug: 'twice-daily', description: 'Runs at 8 AM and 8 PM — morning and evening.' },
    { label: 'Three times daily', expr: '0 8,12,18 * * *', slug: 'three-times-daily', description: 'Runs at 8 AM, noon, and 6 PM.' },

    // — Business hours —
    { label: 'Business hours (9-5)', expr: '0 9-17 * * 1-5', slug: 'business-hours-9-to-5', description: 'Hourly during 9 AM–5 PM, Mon–Fri only. Skip nights and weekends.' },
    { label: 'Business hours start only', expr: '0 9 * * 1-5', slug: 'business-hours-start', description: 'Once at 9 AM on weekdays — workday trigger.' },
    { label: 'Every 30 min in business hours', expr: '*/30 9-17 * * 1-5', slug: 'every-30min-business-hours', description: 'Every 30 minutes between 9 AM and 5 PM, Mon–Fri.' },

    // — Weekly patterns —
    { label: 'Every Monday', expr: '0 9 * * 1', slug: 'every-monday', description: 'Weekly trigger every Monday at 9 AM.' },
    { label: 'Every Tuesday', expr: '0 9 * * 2', slug: 'every-tuesday', description: 'Every Tuesday at 9 AM.' },
    { label: 'Every Wednesday', expr: '0 9 * * 3', slug: 'every-wednesday', description: 'Midweek trigger every Wednesday at 9 AM.' },
    { label: 'Every Thursday', expr: '0 9 * * 4', slug: 'every-thursday', description: 'Every Thursday at 9 AM.' },
    { label: 'Every Friday', expr: '0 9 * * 5', slug: 'every-friday', description: 'End-of-week trigger every Friday at 9 AM.' },
    { label: 'Every Friday at 5 PM', expr: '0 17 * * 5', slug: 'every-friday-5pm', description: 'End-of-week report trigger.' },
    { label: 'Every Saturday', expr: '0 10 * * 6', slug: 'every-saturday', description: 'Weekend job every Saturday at 10 AM.' },
    { label: 'Every Sunday', expr: '0 10 * * 0', slug: 'every-sunday', description: 'Weekly job every Sunday at 10 AM.' },
    { label: 'Every Sunday night', expr: '0 23 * * 0', slug: 'every-sunday-night', description: 'Weekly maintenance window late Sunday.' },
    { label: 'Every weekday', expr: '0 9 * * 1-5', slug: 'every-weekday', description: 'Mon–Fri at 9 AM, skips weekends.' },
    { label: 'Every weekend', expr: '0 10 * * 0,6', slug: 'every-weekend', description: 'Saturday and Sunday at 10 AM.' },
    { label: 'Mon, Wed, Fri', expr: '0 9 * * 1,3,5', slug: 'mon-wed-fri', description: 'Three times a week, alternating days.' },
    { label: 'Tue and Thu', expr: '0 9 * * 2,4', slug: 'tue-and-thu', description: 'Twice a week, Tuesday and Thursday.' },

    // — Monthly patterns —
    { label: 'First of each month', expr: '0 0 1 * *', slug: 'first-of-month', description: 'Monthly billing or report trigger on the 1st.' },
    { label: 'Last day approximation', expr: '0 0 28 * *', slug: 'every-28th', description: 'Runs on the 28th — safe across all months.' },
    { label: '15th of the month', expr: '0 0 15 * *', slug: 'every-15th', description: 'Mid-month trigger for payroll or reporting.' },
    { label: 'First and 15th', expr: '0 0 1,15 * *', slug: 'first-and-15th', description: 'Bi-monthly: 1st and 15th of every month.' },
    { label: 'First Monday of the month', expr: '0 9 1-7 * 1', slug: 'first-monday-of-month', description: 'Runs on the first Monday of each month — standard sprint trigger.' },
    { label: 'Last weekday of month', expr: '0 17 28-31 * 5', slug: 'last-friday-of-month', description: 'Runs on the last Friday of the month.' },
    { label: 'Every 10th of month', expr: '0 0 10 * *', slug: 'every-10th', description: 'Monthly on the 10th — invoice or renewal trigger.' },

    // — Quarterly / seasonal —
    { label: 'Every quarter', expr: '0 0 1 1,4,7,10 *', slug: 'every-quarter', description: 'Jan, Apr, Jul, Oct — quarterly jobs.' },

    // — Specific month patterns —
    { label: 'Every January 1st', expr: '0 0 1 1 *', slug: 'every-january-1st', description: "New Year's Day tasks." },
    { label: 'Every December 31st', expr: '0 23 31 12 *', slug: 'every-december-31st', description: 'Year-end close processes on Dec 31.' },
    { label: 'First of January', expr: '0 0 1 1 *', slug: 'first-of-january', description: 'Annual kickoff — new year setup jobs.' },
    { label: 'First of July', expr: '0 0 1 7 *', slug: 'first-of-july', description: 'Mid-year review trigger on July 1st.' },

    // — Minute-level daily patterns —
    { label: 'Every 5 min during business hours', expr: '*/5 9-17 * * 1-5', slug: 'every-5min-business-hours', description: 'High-frequency polling during working hours only.' },
    { label: 'Every hour on weekdays', expr: '0 * * * 1-5', slug: 'every-hour-weekdays', description: 'Hourly on Monday through Friday only.' },
    { label: 'Every 15 min on weekends', expr: '*/15 * * * 0,6', slug: 'every-15min-weekends', description: 'Frequent polling only on weekends.' },

    // — Offset patterns (non-round-hour for load balancing) —
    { label: 'At minute 30 every hour', expr: '30 * * * *', slug: 'minute-30-every-hour', description: 'Runs at :30 instead of :00 — offsets load from other jobs.' },
    { label: 'At minute 45 every hour', expr: '45 * * * *', slug: 'minute-45-every-hour', description: 'Off-peak minute within the hour.' },

    // — Special system patterns —
    { label: 'At system startup (reboot)', expr: '@reboot', slug: 'at-reboot', description: 'Special @reboot directive — runs once when cron daemon starts.' },
    { label: 'Daily shorthand', expr: '@daily', slug: 'at-daily', description: '@daily is equivalent to 0 0 * * * — midnight every day.' },
    { label: 'Hourly shorthand', expr: '@hourly', slug: 'at-hourly', description: '@hourly is equivalent to 0 * * * *.' },
    { label: 'Weekly shorthand', expr: '@weekly', slug: 'at-weekly', description: '@weekly runs at midnight on Sunday — same as 0 0 * * 0.' },
    { label: 'Monthly shorthand', expr: '@monthly', slug: 'at-monthly', description: '@monthly runs at midnight on the 1st — same as 0 0 1 * *.' },
    { label: 'Yearly shorthand', expr: '@yearly', slug: 'at-yearly', description: '@yearly (or @annually) runs at midnight on Jan 1.' },
];
