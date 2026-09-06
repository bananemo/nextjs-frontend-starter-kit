import { defineRouting } from 'next-intl/routing';
import { AppConfig } from '@/config/app';

export const routing = defineRouting({
  locales: AppConfig.locales,
  defaultLocale: AppConfig.defaultLocale,
  localePrefix: AppConfig.localePrefix,
});
