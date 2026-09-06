import { createNavigation } from 'next-intl/navigation';
import { routing } from './routing';

/**
 * Locale-aware replacements for `next/link` and `next/navigation`.
 *
 * Prefer these over the framework originals so links keep the active locale.
 */
export const { Link, usePathname, useRouter, redirect, getPathname } = createNavigation(routing);
