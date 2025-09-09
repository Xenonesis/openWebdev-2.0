import { test, expect } from '@playwright/test';

test.describe('Settings modal UI', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3003/');
  });

  test('footer visible and save works in light and dark modes', async ({ page }) => {
    // Open settings
    await page.getByRole('button', { name: 'Settings' }).click();

  // Ensure footer buttons are visible in light mode
    const downloadBtn = page.getByRole('button', { name: /Download \.env/i });
    const cancelBtn = page.getByRole('button', { name: /Cancel/i });
    const saveBtn = page.getByRole('button', { name: /Save Settings/i });
  await expect(downloadBtn).toBeVisible();
  await expect(cancelBtn).toBeVisible();
  await expect(saveBtn).toBeVisible();
  await page.screenshot({ path: 'test/playwright/screenshots/light-mode.png' });

    // Toggle dark mode
    await page.getByRole('button', { name: 'Toggle theme' }).click();

  // Ensure they remain visible in dark mode
  await expect(downloadBtn).toBeVisible();
  await expect(cancelBtn).toBeVisible();
  await expect(saveBtn).toBeVisible();
  await page.screenshot({ path: 'test/playwright/screenshots/dark-mode.png' });

    // Click save and expect success message
    await saveBtn.click();
    const success = page.getByText(/Settings saved successfully/i);
    await expect(success).toBeVisible();
    await page.screenshot({ path: 'test/playwright/screenshots/after-save.png' });
  });
});
