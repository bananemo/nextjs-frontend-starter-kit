import { AppConfig } from '@/config/app';
import { getBaseUrl } from '@/lib/seo/urls';

/**
 * `llms.txt` — a structured summary of the site for AI crawlers.
 *
 * This is an emerging convention, not a standard, and Next.js has no file
 * convention for it, so it is served as a plain Route Handler. Treat it as
 * optional: keep it accurate if answer-engine visibility matters to your
 * project, and delete the route if it does not.
 */
export function GET() {
  const baseUrl = getBaseUrl();

  const body = `# ${AppConfig.name}

> ${AppConfig.description}

## Pages

- [Home](${baseUrl}/): Overview of what the starter kit includes.
- [Demo form](${baseUrl}/demo/form): A react-hook-form + zod form that exports its result as a file.

## Notes

- Available languages: ${AppConfig.locales.join(', ')}.
- This is a frontend-only application. There is no database, backend or authentication.
`;

  return new Response(body, {
    headers: {
      'content-type': 'text/plain; charset=utf-8',
      'cache-control': 'public, max-age=3600',
    },
  });
}
