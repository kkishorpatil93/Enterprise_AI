import type { Metadata } from 'next';
import './globals.css';
import { Providers } from '@/components/Providers';

export const metadata: Metadata = {
  title: 'NEXORA AI | Enterprise AI Readiness & Intelligence Platform',
  description:
    'Make every enterprise AI-ready, intelligent and efficient. Find, measure, explain and remediate barriers to enterprise AI adoption.',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-navy-950 text-slate-100 font-sans antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
