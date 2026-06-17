import type { Metadata, Viewport } from 'next';
import { Plus_Jakarta_Sans, Inter } from 'next/font/google';
import './globals.css';
import { asset } from '@/lib/asset';
import { PwaRegister } from '@/components/PwaRegister';

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-jakarta',
  display: 'swap',
});
const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://divakarsharma-ddmr.github.io'),
  title: {
    default: 'MyVoice Surveys | Share Opinions and Earn Rewards',
    template: '%s | MyVoice',
  },
  description:
    'Join MyVoice, a trusted global survey community powered by DataDiggers. Share your opinions, take online surveys, and earn rewards for your time.',
  applicationName: 'MyVoice',
  manifest: asset('/manifest.webmanifest'),
  icons: {
    icon: asset('/assets/logo.jpg'),
    apple: asset('/assets/icons/icon-192.png'),
  },
  openGraph: {
    title: 'MyVoice Surveys | Share Opinions and Earn Rewards',
    description:
      'A trusted global research community powered by DataDiggers. Take surveys, share honest feedback, and get rewarded.',
    siteName: 'MyVoice',
    type: 'website',
  },
};

export const viewport: Viewport = {
  themeColor: '#336666',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${jakarta.variable} ${inter.variable}`}>
      <body className="font-sans">
        {children}
        <PwaRegister />
      </body>
    </html>
  );
}
