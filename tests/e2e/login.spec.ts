import { test, expect } from '@playwright/test';

test('login', async ({ page }) => {
    await page.goto('https://ecommerce-playground.lambdatest.io/');
    await page.getByRole('button', { name: 'My account' }).hover();
    await page.getByTitle('Login').click();
    await page.getByPlaceholder('Email address').click();
    await page.getByPlaceholder('Email address').fill('stefanharlaar@gmail.com');
    await page.getByPlaceholder('Password').click();
    await page.getByPlaceholder('Password').fill('Test123');
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page).toHaveURL('https://ecommerce-playground.lambdatest.io/index.php?route=account/account');
});