import type { Metadata, Viewport } from 'next';
import './globals.css';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#07110e',
};

export const metadata: Metadata = {
  title: 'Agent Legends — AI Agent ID NFT Ecosystem | BNB Smart Chain',
  description:
    'Every Agent Has a Legend. Premier AI Agent ID NFT ecosystem on BNB Smart Chain. 3,333 Genesis NFTs with instant 5,000 to 10,000 LEGEND token gifts.',
  openGraph: {
    title: 'Agent Legends — AI Agent ID NFT Ecosystem',
    description: 'Every Agent Has a Legend. Premier AI Agent ID NFT ecosystem on BNB Smart Chain.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Space+Grotesk:wght@500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#080910] text-[#F8F8FF] antialiased selection:bg-[#8957FF]/30 selection:text-white">
        {children}
      </body>
    </html>
  );
}
