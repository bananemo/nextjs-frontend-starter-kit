import type { Metadata, Viewport } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getTranslations } from 'next-intl/server';
import { Geist, Geist_Mono } from 'next/font/google';
import { LocaleSwitcher } from '@/components/layout/locale-switcher';
import { ThemeToggle } from '@/components/layout/theme-toggle';
import { Providers } from '@/components/providers';
import { Toaster } from '@/components/ui/sonner';
import { AppConfig } from '@/config/app';
import { WebVitals } from '@/lib/analytics/web-vitals';
import { routing } from '@/lib/i18n/routing';
import { buildMetadata } from '@/lib/seo/metadata';
import '@/styles/globals.css';

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'], display: 'swap' });
const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap',
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: 'Metadata' });

  return {
    ...buildMetadata({ description: t('description'), locale }),
    // Applies to child segments, not this one — hence the explicit default.
    title: { default: t('title'), template: `%s | ${AppConfig.name}` },
  };
}

/*
 * `themeColor` belongs on `viewport`, not `metadata`, where it has been
 * deprecated since Next 14.
 */
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
  ],
};

export default async function RootLayout(props: LayoutProps<'/[locale]'>) {
  // Validity is enforced in `src/lib/i18n/request.ts`, which 404s on an
  // unrecognised segment before this renders.
  const locale = await getLocale();

  return (
    // suppressHydrationWarning: next-themes sets `class` on <html> before React
    // hydrates, so server and client markup differ by design.
    <html
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      lang={locale}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col font-sans">
        <NextIntlClientProvider>
          <Providers>
            <header className="flex items-center justify-end gap-1 border-b p-3">
              <LocaleSwitcher />
              <ThemeToggle />
            </header>
            <main className="flex-1">{props.children}</main>
            <Toaster />
            <WebVitals />
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
