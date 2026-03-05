import { test, expect } from '@playwright/test';

test('homepage has title', async ({ page }) => {
    // Go to homepage
    await page.goto('https://ecommerce-playground.lambdatest.io/');

    // Expect title to be 'Your Store'
    expect(await page.title()).toBe('Your Store');
});

test('top products are visible', async ({ page }) => {
    // Go to homepage
    await page.goto('https://ecommerce-playground.lambdatest.io/');

    // Expect 'Top Products' header to be visible
    const topProductsHeader = page.locator('h3.module-title:has-text("Top Products")');
    await expect(topProductsHeader).toBeVisible();

    // Expect product cards to be visible
    const productCards = page.locator('#mz-product-listing-37218399 .product-thumb');
    const productCardsCount = await productCards.count();
    await expect(productCardsCount).toBeGreaterThan(0);

    // Expect product cards to be visible and have a title and price
    for (let i = 0; i < Math.min(productCardsCount, 5); i++) {
        const product = productCards.nth(i);

        // Expect product card to be visible
        await expect(product).toBeVisible();

        // Expect product card to have a title
        const title = product.locator('.caption h4.title a');
        await expect(title).toBeVisible();
        await expect(title).not.toHaveText('');

        // Expect product card to have a price
        const price = product.locator('.caption .price span.price-new');
        await expect(price).toBeVisible();
        await expect(price).not.toHaveText('');
    }
});

test('category menu is visible', async ({ page }) => {
    await page.goto('https://ecommerce-playground.lambdatest.io/');
    await page.getByRole('button', { name: 'Shop by Category' }).click();

    const drawer = page.locator('.mz-pure-drawer.active');
    await expect(drawer).toBeVisible();
    await drawer.getByRole('link', { name: 'Cameras', exact: true }).click();
    await expect(page).toHaveURL('https://ecommerce-playground.lambdatest.io/index.php?route=product/category&path=33');
});