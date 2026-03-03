import { test, expect } from '@playwright/test';

test('homepage has title', async ({ page }) => {
    await page.goto('https://ecommerce-playground.lambdatest.io/');
    expect(await page.title()).toBe('Your Store');
});