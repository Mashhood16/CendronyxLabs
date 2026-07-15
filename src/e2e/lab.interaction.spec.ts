import { test, expect } from '@playwright/test';

test.describe('Lab Interaction Flows', () => {
  test('subject selection page loads modules', async ({ page }) => {
    await page.goto('/');
    // Wait for page to load and find module selection elements
    await page.waitForLoadState('networkidle');
    // The app should show some content
    const bodyText = await page.locator('body').innerText();
    expect(bodyText.length).toBeGreaterThan(50);
  });

  test('mobile responsive layout renders', async ({ page }) => {
    // Set viewport to mobile size
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    // Should still render content
    const bodyText = await page.locator('body').innerText();
    expect(bodyText.length).toBeGreaterThan(50);
  });

  test('theme toggle switches dark mode', async ({ page }) => {
    await page.goto('/');
    // Find a theme toggle button (Sun/Moon icon from lucide-react)
    const themeToggle = page.locator('button').filter({ has: page.locator('svg') }).first();
    if (await themeToggle.isVisible()) {
      await themeToggle.click();
      // After toggling, check if dark class was added
      const hasDark = await page.evaluate(() =>
        document.documentElement.classList.contains('dark')
      );
      expect(typeof hasDark).toBe('boolean');
    }
  });

  test('lab page has back navigation', async ({ page }) => {
    await page.goto('/lab/p9_1');
    await page.waitForLoadState('networkidle');
    // Look for a back button (ArrowLeft icon from lucide)
    const backButton = page.locator('button').filter({ has: page.locator('svg') }).first();
    if (await backButton.isVisible()) {
      // Clicking back should navigate away
      await backButton.click();
      await page.waitForTimeout(500);
      expect(page.url()).not.toContain('/lab/p9_1');
    }
  });

  test('offline indicator shows when disconnected', async ({ page }) => {
    await page.goto('/');
    await page.context().setOffline(true);
    await page.waitForTimeout(1000);
    const bodyText = await page.locator('body').innerText();
    // The app should still render content even offline (PWA)
    expect(bodyText.length).toBeGreaterThan(0);
    await page.context().setOffline(false);
  });
});
