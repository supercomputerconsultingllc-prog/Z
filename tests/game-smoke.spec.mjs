import { test, expect } from '@playwright/test';

async function collectRuntimeErrors(page) {
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error' && !/supabase|cdn\.jsdelivr/i.test(message.text())) {
      errors.push(message.text());
    }
  });
  return errors;
}

test.beforeEach(async ({ page }) => {
  await page.route('https://cdn.jsdelivr.net/**', (route) => route.abort());
});

test('title, settings, start, pause, resume, and restart remain functional', async ({ page }) => {
  const errors = await collectRuntimeErrors(page);
  await page.goto('/index.html');

  await expect(page).toHaveTitle('Zombie Mayhem');
  await expect(page.getByRole('heading', { name: 'Zombie Mayhem' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Start Run' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Settings' })).toBeVisible();

  await page.getByRole('button', { name: 'Settings' }).click();
  await expect(page.getByRole('heading', { name: 'Settings' })).toBeVisible();
  await expect(page.locator('#volumeRange')).toBeVisible();
  await page.getByRole('button', { name: 'Done' }).click();

  await page.getByRole('button', { name: 'Start Run' }).click();
  await expect.poll(() => page.evaluate(() => Boolean(window.__zombieSmoke?.running?.() ?? true))).toBeTruthy();

  const pauseButton = page.locator('#pauseBtn');
  await expect(pauseButton).toBeVisible();
  await pauseButton.click();
  await expect(page.getByRole('heading', { name: 'Paused' })).toBeVisible();

  await page.getByRole('button', { name: 'Unpause' }).click();
  await expect(page.getByRole('heading', { name: 'Paused' })).toBeHidden();

  await pauseButton.click();
  await page.getByRole('button', { name: 'Restart Run' }).click();
  await expect(page.getByRole('heading', { name: 'Zombie Mayhem' })).toBeVisible();
  expect(errors).toEqual([]);
});

test('local settings survive reload when cloud services are unavailable', async ({ page }) => {
  const errors = await collectRuntimeErrors(page);
  await page.goto('/index.html');
  await page.getByRole('button', { name: 'Settings' }).click();

  const volume = page.locator('#volumeRange');
  await volume.fill('37');
  await volume.dispatchEvent('input');
  await page.getByRole('button', { name: 'Done' }).click();
  await page.reload();
  await page.getByRole('button', { name: 'Settings' }).click();
  await expect(page.locator('#volumeRange')).toHaveValue('37');
  expect(errors).toEqual([]);
});

test('capture presets load without crashing', async ({ page }) => {
  const errors = await collectRuntimeErrors(page);
  for (const scene of ['title', 'action', 'wall', 'shop', 'revive']) {
    await page.goto(`/index.html?capture=1&scene=${scene}`);
    await expect(page.locator('canvas')).toBeVisible();
    await expect(page.locator('.app')).toBeVisible();
  }
  expect(errors).toEqual([]);
});
