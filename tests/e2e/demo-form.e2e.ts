import { expect, test } from '@playwright/test';

test.describe('Demo form', () => {
  test('shows a validation error for an invalid email', async ({ page }) => {
    await page.goto('/demo/form');

    await page.getByLabel('Email').fill('not-an-email');
    await page.getByLabel('Name').click(); // blur to trigger validation

    // Scope to the form: Next.js renders its own role="alert" route announcer.
    await expect(page.locator('form').getByText('Enter a valid email address')).toBeVisible();
  });

  test('accepts valid input', async ({ page }) => {
    await page.goto('/demo/form');

    await page.getByLabel('Name').fill('Ada Lovelace');
    await page.getByLabel('Email').fill('ada@example.com');
    await page.getByRole('button', { name: 'Submit' }).click();

    await expect(page.getByText('Thanks, Ada Lovelace.')).toBeVisible();
  });
});
