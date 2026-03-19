import { test, expect } from '@playwright/test';

test('Add products to wishlist and verify', async ({ page }) => {
    // Go to homepage
    await page.goto('https://ecommerce-playground.lambdatest.io/');

    // Login to account
    await page.getByRole('button', { name: 'My account' }).hover();
    await page.getByRole('link', { name: 'Login' }).click();
    await page.getByPlaceholder('E-Mail Address').click();
    await page.getByPlaceholder('E-Mail Address').fill('stefanharlaar@gmail.com');
    await page.getByPlaceholder('Password').click();
    await page.getByPlaceholder('Password').fill('Test123');
    await page.getByRole('button', { name: 'Login' }).click();

    // Navigate to Components category page
    const categoryMenu = page.getByRole('button', { name: 'Shop by Category' });
    await categoryMenu.click();

    const drawer = page.locator('#mz-component-1626147655.mz-pure-drawer');
    await expect(drawer).toBeVisible({ timeout: 5000 });

    const componentsBtn = drawer.getByRole('link').filter({ hasText: 'Components' });

    await drawer.evaluate((el, href) => {
        const link = el.querySelector(`a[href*="${href}"]`);
        if (link) link.scrollIntoView({ block: 'center', inline: 'center' });
    }, 'path=25');

    await componentsBtn.hover();

    await componentsBtn.click({ force: true });

    await expect(page).toHaveURL('https://ecommerce-playground.lambdatest.io/index.php?route=product/category&path=25', { timeout: 10000 });

    // Hover on product 1
    const product1 = page.getByRole('link', { name: 'HTC Touch HD HTC Touch HD HTC' });
    await product1.hover();
    await page.waitForTimeout(5000);

    // Click wishlist icon for product 1
    const wishlistButton1 = product1.getByTitle('Add to Wish List').first();
    await wishlistButton1.click();

    // Check toaster message for adding product to wishlist
    const toaster1 = page.getByText('Success: You have added HTC');
    await expect(toaster1).toBeVisible();

    // Hover on product 2
    const product2 = page.getByRole('link', { name: 'Palm Treo Pro Palm Treo Pro' });
    await product2.hover();
    await page.waitForTimeout(5000);

    // Click wishlist icon for product 2
    const wishlistButton2 = product2.getByTitle('Add to Wish List').nth(1);
    await wishlistButton2.click();

    // Check toaster message for adding product to wishlist
    const toaster2 = page.getByText('Success: You have added Palm');
    await expect(toaster2).toBeVisible();

    // Open wishlist
    const openWishlist = page.getByRole('link', { name: 'Wishlist', exact: true });
    await openWishlist.click();
    await expect(page).toHaveURL('https://ecommerce-playground.lambdatest.io/index.php?route=account/wishlist');

    // Expect header to be visible
    const wishlistHeader = page.getByRole('heading', { name: 'My Wish List' });
    await wishlistHeader.waitFor({ state: 'visible', timeout: 5000 });

    // Expect table to be visible
    const wishlist = page.locator('#content');
    await expect(wishlist).toBeVisible({ timeout: 10000 });

    // Products
    const expectedProducts = ['HTC Touch HD', 'Palm Treo Pro'];

    // Loop over products
    for (const product of expectedProducts) {
        const productLocator = wishlist.locator('td').filter({ hasText: product });
        await expect(productLocator).toBeVisible();
    }
})