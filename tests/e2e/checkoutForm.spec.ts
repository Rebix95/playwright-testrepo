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

    // Set Country field to empty
    await page.locator('#input-payment-country').selectOption({ value: '' });

    // Complete form and continue
    await page.locator('#button-save').click();

    // Assert form validations
    await expect(page.locator('#form-checkout .alert.alert-warning')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('#input-payment-firstname + .invalid-feedback')).toHaveText('First Name must be between 1 and 32 characters!');
    await expect(page.locator('#input-payment-lastname + .invalid-feedback')).toHaveText('Last Name must be between 1 and 32 characters!');
    await expect(page.locator('#input-payment-email + .invalid-feedback')).toHaveText('E-Mail address does not appear to be valid!');
    await expect(page.locator('#input-payment-telephone + .invalid-feedback')).toHaveText('Telephone must be between 3 and 32 characters!');
    await expect(page.locator('#input-payment-telephone + .invalid-feedback')).toHaveText('Telephone must be between 3 and 32 characters!');
    await expect(page.locator('#input-payment-address-1 + .invalid-feedback')).toHaveText('Address 1 must be between 3 and 128 characters!');
    await expect(page.locator('#input-payment-city + .invalid-feedback')).toHaveText('City must be between 2 and 128 characters!');
    await expect(page.locator('#input-payment-country + .invalid-feedback')).toHaveText('Please select a country!');
})