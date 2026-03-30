import { test, expect } from '@playwright/test';
import { switchRole, clickNav } from './helpers';

test.describe('Company Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(500);
    await switchRole(page, 'Company');
    await clickNav(page, 'My Listings');
    await page.waitForTimeout(500);
  });

  test('company dashboard renders with module tabs', async ({ page }) => {
    const body = await page.locator('body').innerText();
    expect(body).toContain('Jobs');
    expect(body).toContain('Projects');
    expect(body).toContain('Courses');
    expect(body).toContain('Referrals');
  });

  test('referrals tab shows upgrade banner', async ({ page }) => {
    await page.getByText('Referrals').click();
    await page.waitForTimeout(300);
    await expect(page.getByText(/upgrade your profile/i)).toBeVisible();
    await expect(page.getByRole('button', { name: 'Upgrade' })).toBeVisible();
  });

  test('project applications page renders', async ({ page }) => {
    await page.getByText('Projects').click();
    await page.waitForTimeout(300);

    // Click Applications button on a project listing if visible
    const appsBtn = page.getByRole('button', { name: /applications|applicants/i }).first();
    if (await appsBtn.isVisible()) {
      await appsBtn.click();
      await page.waitForTimeout(500);
      // Should render ProjectApplicationsPage
      await expect(page.getByText('AI-Driven Mental Health Chatbot')).toBeVisible();
    }
  });
});
