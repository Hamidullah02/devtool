import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'DevNet Tools — Free Developer & Networking Utilities',
    template: '%s | DevNet Tools',
  },
  description:
    'Free online developer and networking tools: JSON to TypeScript, Cron generator, Regex explainer, Subnet calculator, Base64, UUID and more.',
  keywords: ['developer tools', 'devtools', 'cron generator', 'json to typescript', 'regex explainer', 'subnet calculator', 'base64', 'uuid generator'],
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://devnettools.com'),
  openGraph: {
    siteName: 'DevNet Tools',
    type: 'website',
  },
  twitter: { card: 'summary_large_image' },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        {/* Google Analytics placeholder — replace GA_MEASUREMENT_ID */}
        {/* <script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID" /> */}
      </head>
      <body>{children}</body>
    </html>
  );
}
