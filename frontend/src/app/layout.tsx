import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import localFont from 'next/font/local';
import Providers from './providers';
import './icon/tabler-300.css';

const inter = Inter({
  subsets: ['latin'],
});

const tablerIcons = localFont({
  src: [
    {
      path: './icon/fonts/tabler-icons-300-outline.woff2',
      weight: '400',
      style: 'normal',
    },
  ],
  variable: '--font-tabler-icons',
  display: 'swap',
  preload: true,
});

export const metadata: Metadata = {
  title: 'Grupo SER - Portal Institucional',
  description: 'Portal multi-institucional do Grupo SER Educacional',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={tablerIcons.variable}>
      <link rel="icon" href="/favicon/grupo-ser.ico" />

      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
