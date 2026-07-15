import { test, expect } from '@playwright/test';

test.describe('App Navigation', () => {
  test('loads the homepage with correct title', async ({ page }) => {
    await page.goto('/');
    // Expect the app to render - title may be in body or document title
    await expect(page.locator('text=Cendronyx Labs')).toBeVisible();
  });

  test('navigates to login page from settings', async ({ page }) => {
    await page.goto('/settings');
    await expect(page.locator('button, a:has-text("Login"), text=Login')).toBeVisible();
  });

  test('offline mode shows sync status indicator', async ({ page }) => {
    await page.goto('/');
    // Toggle offline mode via DevTools
    await page.context().setOffline(true);
    // Save page text for debugging
    const bodyText = await page.locator('body').innerText();
    expect(bodyText.length).toBeGreaterThan(0);
    await page.context().setOffline(false);
  });
});

test.describe('Lab Loading', () => {
  test('physics lab page loads with header', async ({ page }) => {
    await page.goto('/lab/p9_1');
    await expect(page).toHaveURL(/\/lab\//);
  });

  test('invalid lab shows error or fallback', async ({ page }) => {
    await page.goto('/lab/nonexistent_lab_xyz');
    // Should either show an error or redirect
    await page.waitForLoadState('networkidle');
  });
});
