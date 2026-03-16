import { test, expect } from '@playwright/test';

test('checkout happy flow', async ({ page }) => {
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

    // Enter personal details
    await page.locator('#input-payment-firstname').fill('Stefan');
    await page.locator('#input-payment-lastname').fill('Test');
    await page.locator('#input-payment-email').fill('s.test@test.com');
    await page.locator('#input-payment-telephone').fill('+31612345678');

    // Enter billing address
    await page.locator('#input-payment-address-1').fill('Teststreet 10');
    await page.locator('#input-payment-city').fill('Testcity');
    await page.locator('#input-payment-postcode').fill('1000AB');
    await page.locator('#input-payment-country').selectOption('150');
    await page.locator('#input-payment-zone').selectOption('2336');

    // Accept Terms & Conditions
    const checkTerms = page.locator('#input-agree');
    await checkTerms.waitFor({ state: 'visible'});
    await checkTerms.click({ force: true });
    await expect(checkTerms).toBeChecked();

    // Complete form and continue
    await page.locator('#button-save').click();

    // Check correct page is showing
    const confirmPageURL = 'https://ecommerce-playground.lambdatest.io/index.php?route=extension/maza/checkout/confirm';
    await expect(page).toHaveURL(confirmPageURL);

    // Click confirm order
    await page.locator('#button-confirm').click();

    // Check if succes page is showing
    const succesPageURL = 'https://ecommerce-playground.lambdatest.io/index.php?route=checkout/success';
    await expect(page).toHaveURL(succesPageURL);

    await expect(page.getByRole('heading', { name: /Your order has been placed!/i })).toBeVisible();
})