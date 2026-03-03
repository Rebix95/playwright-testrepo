import { test, expect } from '@playwright/test';

test('login', async ({ page }) => {
    await page.goto('https://ecommerce-playground.lambdatest.io/');
    await page.getByRole('button', { name: 'My account' }).hover();
    await page.getByTitle('Login').click();
});