import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { generateThemeInjectionScript } from '@/lib/themes/script-generator';
import Providers from './providers';

const inter = Inter({
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'HFSA',
  description:
    'Hybrid Feature Scope Architecture with NextAuth, React Query, Axios',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // Generate theme injection script during SSR
  // This prevents FOUC by injecting CSS before first paint
  const themeScript = generateThemeInjectionScript();

  return (
    <html lang="en">
      <head>
        {/*
          CRITICAL: Blocking script that injects institution theme CSS.
          - Runs synchronously before React hydration
          - Prevents FOUC (Flash of Unstyled Content)
          - Do NOT add async or defer attributes
          - Small performance cost (~1-5ms) vs visual flash (~50-200ms)
        */}
        <script
          id="institution-theme-injection"
          dangerouslySetInnerHTML={{ __html: themeScript }}
        />
      </head>
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
