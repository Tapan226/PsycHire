import { test, expect } from '@playwright/test';
import { clickNav, assertNotBlank } from './helpers';

test.describe('Jobs Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(500);
    await clickNav(page, 'Opportunities');
    await page.waitForTimeout(500);
  });

  test('student sees job restriction banner', async ({ page }) => {
    await expect(page.getByText(/student view/i)).toBeVisible();
    await expect(page.getByText(/internships.*entry-level/i)).toBeVisible();
  });

  test('job cards show date posted and deadline', async ({ page }) => {
    // First job card should have date info
    await expect(page.getByText('Feb 9, 2026')).toBeVisible();
    await expect(page.getByText('Due Apr 15, 2026')).toBeVisible();
  });

  test('job details page renders with contact person', async ({ page }) => {
    // Click on a job card (View Details)
    await page.getByText('View Details').first().click();
    await page.waitForTimeout(500);

    // Job details should render
    await assertNotBlank(page);

    // Contact Person section in sidebar
    await expect(page.getByText('Contact Person').first()).toBeVisible();
    await expect(page.getByText('Dr. Meera Sharma').first()).toBeVisible();

    // Visit Website + Visit Page links
    await expect(page.getByText('Visit Website').first()).toBeVisible();
    await expect(page.getByText('Visit Page').first()).toBeVisible();
  });

  test('apply method modal shows options', async ({ page }) => {
    await page.getByText('View Details').first().click();
    await page.waitForTimeout(500);

    // Click Apply button
    await page.getByRole('button', { name: /apply/i }).first().click();
    await page.waitForTimeout(300);

    // Apply method modal
    await expect(page.getByText('Apply with Profile')).toBeVisible();
    await expect(page.getByText('Apply with Custom Details')).toBeVisible();
  });
});
