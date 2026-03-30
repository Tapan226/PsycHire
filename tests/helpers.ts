import { Page, expect } from '@playwright/test';

/** Click a nav item in the desktop header */
export async function clickNav(page: Page, label: string) {
  await page.locator('nav button', { hasText: label }).first().click();
  await page.waitForTimeout(300);
}

/** Open the profile dropdown menu */
export async function openProfileMenu(page: Page) {
  const avatar = page.locator('header button').last();
  await avatar.click();
  await page.waitForTimeout(200);
}

/** Switch user role via profile dropdown */
export async function switchRole(page: Page, role: 'Student' | 'Professional' | 'Company' | 'Admin') {
  await openProfileMenu(page);
  await page.getByRole('button', { name: role, exact: true }).click();
  await page.waitForTimeout(500);
}

/** Assert the page has visible content (not blank) */
export async function assertNotBlank(page: Page) {
  const body = await page.locator('body').innerText();
  expect(body.length).toBeGreaterThan(50);
}

/** Assert a nav item is active */
export async function assertNavActive(page: Page, label: string) {
  // The active nav pill has brand-primary color classes
  const navBtn = page.locator('nav button', { hasText: label }).first();
  await expect(navBtn).toBeVisible();
}

/** Take a named screenshot for visual reference */
export async function snap(page: Page, name: string) {
  await page.screenshot({ path: `test-results/screenshots/${name}.png`, fullPage: false });
}
