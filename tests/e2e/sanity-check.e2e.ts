import { expect, test } from '@playwright/test';

test.describe('Sanity', () => {
  test('renders the home page', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });

  test('serves metadata routes outside the locale prefix', async ({ request }) => {
    const paths = ['/robots.txt', '/sitemap.xml', '/manifest.webmanifest', '/llms.txt'];

    const statuses = await Promise.all(
      paths.map(async (path) => {
        const response = await request.get(path);
        return [path, response.status()] as const;
      }),
    );

    for (const [path, status] of statuses) {
      expect(status, `${path} should not be locale-prefixed`).toBe(200);
    }
  });

  test('serves a locale-scoped Open Graph image', async ({ request }) => {
    const response = await request.get('/en/opengraph-image');

    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('image/png');
  });

  test('switches locale and translates the page', async ({ page }) => {
    await page.goto('/zh-TW');

    await expect(page.locator('html')).toHaveAttribute('lang', 'zh-TW');
    await expect(page.getByRole('heading', { level: 1 })).toContainText('前端');
  });

  test('sets security headers', async ({ request }) => {
    const response = await request.get('/');
    const headers = response.headers();

    expect(headers['x-content-type-options']).toBe('nosniff');
    expect(headers['content-security-policy']).toContain("frame-ancestors 'none'");
  });
});
