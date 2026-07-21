import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from './providers';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: {
    default: 'Vitis — The Commerce Platform',
    template: '%s | Vitis',
  },
  description: 'Shop millions of products, sell globally, and grow your business with Vitis — the modern commerce platform.',
  keywords: ['ecommerce', 'marketplace', 'shopping', 'online store'],
  authors: [{ name: 'Vitis' }],
  creator: 'Vitis',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://commerceos.app',
    siteName: 'Vitis',
    title: 'Vitis — Commerce Platform',
    description: 'The future of commerce is here.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vitis',
    description: 'The Modern Commerce Platform',
  },
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0f1117' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
