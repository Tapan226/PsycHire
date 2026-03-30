import { test, expect } from '@playwright/test';

test.describe('Dashboard & Notifications', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(500);
  });

  test('dashboard renders all sections', async ({ page }) => {
    // Hero stats
    await expect(page.getByText('ACTIVE APPLICATIONS')).toBeVisible();
    await expect(page.getByText('INTERVIEWS')).toBeVisible();
    await expect(page.getByText('ONGOING PROJECTS')).toBeVisible();
    await expect(page.getByText('Profile')).toBeVisible();

    // In Progress section
    await expect(page.getByText('In Progress')).toBeVisible();

    // Recommendations
    await expect(page.getByText('Recommended Jobs')).toBeVisible();
    await expect(page.getByText('Recommended Projects')).toBeVisible();
    await expect(page.getByText('Recommended Courses')).toBeVisible();

    // Upcoming sidebar
    await expect(page.getByText('Upcoming')).toBeVisible();
  });

  test('notification bell opens dropdown with notifications', async ({ page }) => {
    // Click bell icon (it's the Notifications button)
    await page.getByRole('button', { name: 'Notifications' }).click();
    await page.waitForTimeout(200);

    // Dropdown should show
    await expect(page.getByText('Notifications')).toBeVisible();
    await expect(page.getByText('Mark all read')).toBeVisible();

    // Specific notifications
    await expect(page.getByText('Application Shortlisted')).toBeVisible();
    await expect(page.getByText('New Connection Request')).toBeVisible();

    // Notification Settings link
    await expect(page.getByText('Notification Settings')).toBeVisible();
  });

  test('mark all read clears badge', async ({ page }) => {
    await page.getByRole('button', { name: 'Notifications' }).click();
    await page.waitForTimeout(200);
    await page.getByText('Mark all read').click();
    await page.waitForTimeout(200);

    // Mark all read button should disappear (no more unread)
    await expect(page.getByText('Mark all read')).not.toBeVisible();
  });

  test('profile menu shows all items', async ({ page }) => {
    await page.locator('header button').last().click();
    await page.waitForTimeout(200);

    await expect(page.getByRole('button', { name: 'View Profile' })).toBeVisible();
    await expect(page.getByText('Connection Requests')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Settings' })).toBeVisible();
    await expect(page.getByText('Help & Support')).toBeVisible();
    await expect(page.getByText('SWITCH ROLE')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Sign Out' })).toBeVisible();
  });
});
