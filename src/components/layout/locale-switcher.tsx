'use client';

import { Languages } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { AppConfig } from '@/config/app';
import { usePathname, useRouter } from '@/lib/i18n/navigation';

export function LocaleSwitcher() {
  const t = useTranslations('LocaleSwitcher');
  const activeLocale = useLocale();
  const router = useRouter();
  // Locale-aware: returns the path without the locale prefix.
  const pathname = usePathname();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon" variant="ghost">
          <Languages className="size-4" />
          <span className="sr-only">{t('label')}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {AppConfig.locales.map((locale) => (
          <DropdownMenuItem
            disabled={locale === activeLocale}
            key={locale}
            onClick={() => {
              router.replace(pathname, { locale });
            }}
          >
            {t(locale)}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
