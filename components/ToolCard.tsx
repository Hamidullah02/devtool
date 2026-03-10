import Link from 'next/link';
import { LucideIcon } from 'lucide-react';

interface ToolCardProps {
    title: string;
    description: string;
    href: string;
    icon: LucideIcon;
    tag?: string;
    isNew?: boolean;
}

export default function ToolCard({ title, description, href, icon: Icon, tag, isNew }: ToolCardProps) {
    return (
        <Link href={href} className="glow-card p-5 flex flex-col gap-3 group no-underline" style={{ color: 'inherit', textDecoration: 'none' }}>
            <div className="flex items-start justify-between">
                <div
                    className="p-2 rounded-lg"
                    style={{ background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.2)' }}
                >
                    <Icon size={20} style={{ color: 'var(--accent)' }} />
                </div>
                <div className="flex gap-1.5">
                    {isNew && <span className="tag" style={{ background: 'rgba(16,185,129,0.1)', color: '#10b981', borderColor: 'rgba(16,185,129,0.2)' }}>New</span>}
                    {tag && <span className="tag">{tag}</span>}
                </div>
            </div>

            <div>
                <h3 className="font-semibold text-base mb-1" style={{ color: 'var(--text-primary)' }}>
                    {title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    {description}
                </p>
            </div>

            <div
                className="text-xs font-medium flex items-center gap-1 transition-all"
                style={{ color: 'var(--accent)' }}
            >
                Open Tool →
            </div>
        </Link>
    );
}
