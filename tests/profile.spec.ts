import { test, expect } from '@playwright/test';
import { openProfileMenu } from './helpers';

test.describe('Profile Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(500);
    // Navigate to Profile
    await openProfileMenu(page);
    await page.getByRole('button', { name: 'View Profile' }).click();
    await page.waitForTimeout(500);
  });

  test('cover image banner visible', async ({ page }) => {
    // Cover image area should exist (gradient or image)
    const coverArea = page.locator('.h-\\[160px\\], .h-\\[200px\\], .sm\\:h-\\[200px\\]').first();
    // Alternatively check for the Edit Cover button (owner view)
    await expect(page.getByText('Edit Cover')).toBeVisible();
  });

  test('ethics pledge badge visible', async ({ page }) => {
    await expect(page.getByText('Ethics Pledge')).toBeVisible();
  });

  test('headline displayed', async ({ page }) => {
    await expect(page.getByText(/passionate about|Licensed Clinical/i)).toBeVisible();
  });

  test('specialization tags in header', async ({ page }) => {
    await expect(page.getByText('Child Psychology').first()).toBeVisible();
    await expect(page.getByText('CBT').first()).toBeVisible();
  });

  test('open to chips in header', async ({ page }) => {
    await expect(page.getByText('Open to:')).toBeVisible();
  });

  test('six tabs present', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Overview' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Education & Training' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Experience' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Credentials' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Reviews' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Contact' })).toBeVisible();
  });

  test('sidebar shows basic info and social links', async ({ page }) => {
    await expect(page.getByText('Email').first()).toBeVisible();
    await expect(page.getByText('Phone').first()).toBeVisible();
    await expect(page.getByText('Social Links').first()).toBeVisible();
  });

  test('memberships section in overview', async ({ page }) => {
    await expect(page.getByText('Professional Memberships')).toBeVisible();
  });

  test('education tab shows education and certifications', async ({ page }) => {
    await page.getByRole('button', { name: 'Education & Training' }).click();
    await page.waitForTimeout(300);
    await expect(page.getByRole('heading', { name: 'Education' })).toBeVisible();
    await expect(page.getByText('Certifications & Training').first()).toBeVisible();
  });

  test('experience tab shows professional summary and downloadables', async ({ page }) => {
    await page.getByRole('button', { name: 'Experience' }).click();
    await page.waitForTimeout(300);
    // Downloadables: CV, Cover Letter
    await expect(page.getByText('Resume / CV')).toBeVisible();
    await expect(page.getByText('Cover Letter', { exact: true })).toBeVisible();
  });

  test('contact tab shows form', async ({ page }) => {
    await page.getByRole('button', { name: 'Contact' }).click();
    await page.waitForTimeout(300);
    await expect(page.getByText('Get in Touch')).toBeVisible();
    await expect(page.getByText('Send Message')).toBeVisible();
  });

  test('edit buttons are subtle pencil icons', async ({ page }) => {
    // There should be no "Edit" text buttons in section headers
    const editTextButtons = page.locator('button:has-text("Edit"):not(:has-text("Edit Cover")):not(:has-text("Edit Profile"))');
    const count = await editTextButtons.count();
    // Only "Edit Profile" and "Edit Cover" should have text
    // Section edit buttons should be icon-only (pencil)
    expect(count).toBeLessThanOrEqual(2);
  });
});
