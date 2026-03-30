import { test, expect } from '@playwright/test';
import { clickNav, switchRole, assertNotBlank } from './helpers';

test.describe('Role Switching & Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(500);
  });

  test('student has correct nav items', async ({ page }) => {
    // Default is Student
    const nav = page.locator('nav');
    await expect(nav.getByRole('button', { name: 'Dashboard', exact: true })).toBeVisible();
    await expect(nav.getByRole('button', { name: 'Opportunities', exact: true })).toBeVisible();
    await expect(nav.getByRole('button', { name: 'Learning', exact: true })).toBeVisible();
    await expect(nav.getByRole('button', { name: 'Community', exact: true })).toBeVisible();
    await expect(nav.getByRole('button', { name: 'Events', exact: true })).toBeVisible();
    await expect(nav.getByRole('button', { name: 'Network', exact: true })).toBeVisible();
    await expect(nav.getByRole('button', { name: 'Funding', exact: true })).toBeVisible();
    // Should NOT have My Listings or Admin Dashboard
    await expect(nav.getByRole('button', { name: 'My Listings' })).toHaveCount(0);
    await expect(nav.getByRole('button', { name: 'Admin Dashboard' })).toHaveCount(0);
  });

  test('professional role changes dashboard content', async ({ page }) => {
    await switchRole(page, 'Professional');
    await expect(page.getByRole('heading', { name: /Hello, Dr/i })).toBeVisible();
    await expect(page.getByText('ACTIVE PROJECTS')).toBeVisible();
    await assertNotBlank(page);
  });

  test('company role adds My Listings nav', async ({ page }) => {
    await switchRole(page, 'Company');
    const nav = page.locator('nav');
    await expect(nav.getByText('My Listings')).toBeVisible();
    await expect(page.getByText('MindCare')).toBeVisible();
  });

  test('admin role adds Admin Dashboard nav', async ({ page }) => {
    await switchRole(page, 'Admin');
    const nav = page.locator('nav');
    await expect(nav.getByText('Admin Dashboard')).toBeVisible();
  });

  test('all nav items navigate without blank screens', async ({ page }) => {
    const navItems = ['Opportunities', 'Learning', 'Community', 'Events', 'Network', 'Funding'];
    for (const item of navItems) {
      await clickNav(page, item);
      await assertNotBlank(page);
    }
    // Back to Dashboard
    await clickNav(page, 'Dashboard');
    await expect(page.getByText('Hello')).toBeVisible();
  });
});

test.describe('Events as Standalone Section', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(500);
  });

  test('events nav leads to events page (not network)', async ({ page }) => {
    await clickNav(page, 'Events');
    await page.waitForTimeout(500);
    // Should show events content
    const body = await page.locator('body').innerText();
    expect(body).toContain('Events');
    // Module selector should NOT contain People or Companies
    expect(body).not.toMatch(/People\s+Companies/);
  });

  test('network page shows only People and Companies', async ({ page }) => {
    await clickNav(page, 'Network');
    await page.waitForTimeout(300);
    const body = await page.locator('body').innerText();
    expect(body).toContain('People');
    expect(body).toContain('Companies');
  });
});
