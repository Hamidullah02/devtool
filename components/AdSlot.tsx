interface AdSlotProps {
    placement: 'header' | 'sidebar' | 'below-output';
    className?: string;
}

const placementConfig = {
    header: { label: 'Advertisement — 728×90', height: '90px', width: '100%' },
    sidebar: { label: 'Advertisement — 300×250', height: '250px', width: '300px' },
    'below-output': { label: 'Advertisement — 336×280', height: '280px', width: '336px' },
};

export default function AdSlot({ placement, className = '' }: AdSlotProps) {
    const config = placementConfig[placement];
    return (
        <div
            className={`ad-slot ${className}`}
            style={{ height: config.height, maxWidth: config.width }}
            aria-label="Advertisement"
            data-ad-placement={placement}
        >
            {/* Replace with Google AdSense <ins> tag */}
            <span>{config.label}</span>
        </div>
    );
}
