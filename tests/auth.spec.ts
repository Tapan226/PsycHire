import { test, expect } from '@playwright/test';

test.describe('Auth Flow', () => {
  test('login page renders with two-column branding layout', async ({ page }) => {
    // Start logged out by navigating and triggering logout
    await page.goto('/');
    // The app starts logged in by default, so we need to log out first
    // Click profile avatar → Sign Out
    await page.locator('header button').last().click();
    await page.getByRole('button', { name: 'Sign Out' }).click();
    await page.waitForTimeout(500);

    // Login page should render
    await expect(page.getByText('Welcome Back').first()).toBeVisible();
    await expect(page.getByRole('button', { name: 'Sign In' })).toBeVisible();
    await expect(page.getByText("India's Professional Network for Psychology").first()).toBeVisible();

    // Form fields present
    await expect(page.getByPlaceholder('Enter your email')).toBeVisible();
    await expect(page.getByPlaceholder('Enter your password')).toBeVisible();
  });

  test('signup page has correct fields', async ({ page }) => {
    await page.goto('/');
    // Log out
    await page.locator('header button').last().click();
    await page.getByRole('button', { name: 'Sign Out' }).click();
    await page.waitForTimeout(500);

    // Navigate to Signup
    await page.getByRole('button', { name: 'Create Account' }).click();
    await page.waitForTimeout(500);

    // Signup page should show
    await expect(page.getByRole('heading', { name: 'Create Account' })).toBeVisible();

    // Country code selector
    await expect(page.getByText('+91').first()).toBeVisible();

    // Password fields exist (2 password inputs: password + confirm)
    const passwordFields = page.locator('input[type="password"]');
    await expect(passwordFields).toHaveCount(2);

    // Ethics pledge text
    await expect(page.getByText('Professional Code of Ethics')).toBeVisible();

    // Submit button
    await expect(page.getByRole('button', { name: /verify.*continue/i })).toBeVisible();
  });

  test('password strength meter works', async ({ page }) => {
    await page.goto('/');
    await page.locator('header button').last().click();
    await page.getByRole('button', { name: 'Sign Out' }).click();
    await page.waitForTimeout(500);
    await page.getByRole('button', { name: 'Create Account' }).click();
    await page.waitForTimeout(500);

    // Type a weak password
    const passwordField = page.locator('input[type="password"]').first();
    // First clear the prefilled value by clicking the show/hide toggle then clearing
    await passwordField.fill('abc');
    await expect(page.getByText('Weak')).toBeVisible();

    // Type strong
    await passwordField.fill('StrongPass@123');
    await expect(page.getByText('Strong')).toBeVisible();
  });
});
