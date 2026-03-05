import { test, expect } from '@playwright/test';

test('product search', async ({ page }) => {
    // Go to homepage
    await page.goto('https://ecommerce-playground.lambdatest.io/');

    // Enter 'Macbook' in search field and search
    const searchInput = page.getByRole('textbox', { name: 'Search For Products' });
    await searchInput.fill('MacBook');
    await page.getByRole('button', { name: 'Search' }).click();
    await expect(page).toHaveURL('https://ecommerce-playground.lambdatest.io/index.php?route=product%2Fsearch&search=MacBook');

    // Check if product grid is visible
    const productGrid = page.locator('#entry_212469');
    await expect(productGrid).toBeVisible();

    // Check if product cards are visible
    const products = productGrid.locator('.product-layout.product-grid');
    await expect(products.first()).toBeVisible();

    // Check if first product title contains 'MacBook'
    const productTitles = productGrid.locator('.caption h4.title a');
    await expect(productTitles.first()).toContainText(/MacBook/i);

    // Check if all product titles contain 'MacBook'
    const titles = await productTitles.allTextContents();
    expect(titles.every(title => /MacBook/i.test(title))).toBe(true);
});