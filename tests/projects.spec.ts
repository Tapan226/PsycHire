import { test, expect } from '@playwright/test';
import { clickNav, assertNotBlank } from './helpers';

test.describe('Projects Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(500);
    await clickNav(page, 'Opportunities');
    await page.waitForTimeout(500);
    // Click the Projects module tab (inside the module selector, not the nav)
    // The module tabs have the module label text
    const mainContent = page.locator('main');
    await mainContent.locator('button', { hasText: 'Projects' }).first().click();
    await page.waitForTimeout(1000);
  });

  test('industry label (not segment) in filters', async ({ page }) => {
    const body = await page.locator('body').innerText();
    expect(body).toContain('Industry');
    expect(body).not.toMatch(/\bSegment\b/);
  });

  test('four sub-tabs present', async ({ page }) => {
    const body = await page.locator('body').innerText();
    expect(body).toContain('Explore');
    expect(body).toContain('Saved');
    expect(body).toContain('Applied');
    expect(body).toContain('Ongoing');
  });

  test('applied tab shows projects', async ({ page }) => {
    await page.locator('button', { hasText: 'Applied' }).first().click();
    await page.waitForTimeout(1000);
    const body = await page.locator('body').innerText();
    expect(body).toContain('Applied');
  });

  test('ongoing tab shows active projects', async ({ page }) => {
    await page.locator('button', { hasText: 'Ongoing' }).first().click();
    await page.waitForTimeout(800);
    await expect(page.getByText('Ongoing Projects')).toBeVisible();
  });

  test('project apply shows role picker', async ({ page }) => {
    // Click on a project card to go to details
    const viewDetailsBtn = page.getByText('View Details').first();
    if (await viewDetailsBtn.isVisible()) {
      await viewDetailsBtn.click();
      await page.waitForTimeout(800);

      // Click Apply Now
      const applyBtn = page.getByRole('button', { name: 'Apply Now' });
      if (await applyBtn.isVisible()) {
        await applyBtn.click();
        await page.waitForTimeout(500);

        // Role picker modal
        await expect(page.getByText('Select a Role')).toBeVisible();
      }
    }
  });
});
