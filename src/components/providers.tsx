'use client';

import { ThemeProvider } from 'next-themes';
import type { ReactNode } from 'react';
import { QueryProvider } from '@/lib/query/provider';

/**
 * Client-side providers, mounted once in the root layout.
 *
 * `attribute="class"` makes next-themes toggle `class="dark"` on <html>, which
 * is what the `@custom-variant dark` rule in globals.css keys off.
 */
export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" disableTransitionOnChange enableSystem>
      <QueryProvider>{children}</QueryProvider>
    </ThemeProvider>
  );
}
