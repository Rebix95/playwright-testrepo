import { test, expect } from '@playwright/test';

test('Checkout unhappy form flow', async ({ page }) => {
    // Go to HP LP3065 product page
    await page.goto('https://ecommerce-playground.lambdatest.io/index.php?route=product/product&product_id=47');

    // Add product to cart
    const addToCartBtn = page.getByRole('button', { name: 'Add to Cart' });
    await addToCartBtn.click();

    // Wait for notification box to close
    await page.locator('#notification-box-top').waitFor({ state: 'hidden' });

    // Open fly-in cart
    const cartBtn = page.locator('#entry_217825 a.cart');
    await cartBtn.click();

    // Check if fly-in cart is visible
    const flyInCart = page.locator('#cart-total-drawer');
    await expect(flyInCart).toBeVisible();

    // Click Checkout button
    await page.getByRole('button', { name: ' Checkout' }).click();

    // Click Guest Checkout
    const guestRadio = page.getByLabel('Guest Checkout');
    await guestRadio.waitFor({ state: 'visible' });
    await guestRadio.click({ force: true });
    await expect(guestRadio).toBeChecked();

    // Accept Terms & Conditions
    const checkTerms = page.locator('#input-agree');
    await checkTerms.waitFor({ state: 'visible'});
    await checkTerms.click({ force: true });
    await expect(checkTerms).toBeChecked();

    // Complete form and continue
    await page.locator('#button-save').click();

    // Assert form validations
})