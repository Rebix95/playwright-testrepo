import { test, expect } from '@playwright/test';
import testData from '../../fixtures/testData.json';
import { UserData } from '../../fixtures/types';
import { CheckoutPage } from '../../pages/CheckoutPage';

const dataSet: UserData[] = testData;

test.describe.parallel('Checkout Data-Driven Tests', () => {
    for (const data of dataSet) {
        test(`Checkout test: ${data.description}`, async ({ page }) => {
            const checkoutPage = new CheckoutPage(page);

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

            // -------------------------------------------------------------------------

            // Fill data through Page Object
            await checkoutPage.fillPersonalDetails(data);
            await checkoutPage.fillBillingAddress(data);
            await checkoutPage.acceptTerms();
            await checkoutPage.submitForm();

            // Validation through Page Object

            if (data.expectedErrors) {
                await checkoutPage.validationFieldErrors(data.expectedErrors);
            } else {

                // Check correct page is showing
                await expect(page).toHaveURL(/checkout\/confirm/);

                // Click confirm order
                await page.locator('#button-confirm').click();

                // Check if succes page is showing
                await expect(page).toHaveURL(/checkout\/success/);

                await expect(page.getByRole('heading', { name: /Your order has been placed!/i })).toBeVisible();
            }
        })
    }
})