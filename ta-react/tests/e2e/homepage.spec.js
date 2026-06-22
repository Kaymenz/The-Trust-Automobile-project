import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('should load the homepage and display key elements', async ({ page }) => {
    // Navigate to homepage
    await page.goto('/');

    // Check page title or main heading
    const heading = page.locator('h1');
    await expect(heading).toContainText('Buy & Sell Cars');
    await expect(heading).toContainText('With Trust');

    // Check search button presence
    const searchBtn = page.locator('a.btn-primary', { hasText: 'Search' });
    await expect(searchBtn).toBeVisible();

    // Check for Ghanaian badge
    const badge = page.locator('.hero-badge');
    await expect(badge).toContainText("Ghana's #1 Verified Car Marketplace");
  });
});
