import { test, expect } from '@playwright/test';

test('add to cart', async ({ page }) => {
    // Go to homepage
    await page.goto('https://ecommerce-playground.lambdatest.io/');

    // Click Add to Cart button on iMac product
    await page.getByRole('link', { name: 'iMac' }).hover();
    await page.getByRole('button', { name: /Add to Cart/i }).click();

});