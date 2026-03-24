import { test, expect } from '@playwright/test';
import testData from '../../fixtures/testData.json';
import { UserData } from '../../fixtures/types';

const dataSet: UserData[] = testData;

test.describe.parallel('Checkout Data-Driven Tests', () => {
    for (const data of dataSet) {
        test(`Checkout test: ${data.description}`, async ({ page }) => {

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

            // Enter personal details
            await page.locator('#input-payment-firstname').fill(data.firstName);
            await page.locator('#input-payment-lastname').fill(data.lastName);
            await page.locator('#input-payment-email').fill(data.email);
            await page.locator('#input-payment-telephone').fill(data.phone);

            // Enter billing address
            await page.locator('#input-payment-address-1').fill(data.address);
            await page.locator('#input-payment-city').fill(data.city);
            await page.locator('#input-payment-postcode').fill(data.postcode);
            await page.locator('#input-payment-country').selectOption({ value: data.country });
            await page.locator('#input-payment-zone').selectOption({ value: data.zone });

            // Accept Terms & Conditions
            const checkTerms = page.locator('#input-agree');
            await checkTerms.waitFor({ state: 'visible'});
            await checkTerms.click({ force: true });
            await expect(checkTerms).toBeChecked();

            // Complete form and continue
            await page.getByRole('button', { name: 'Continue ' }).click();

            // Validation
            if (data.expectedErrors !== null) {
                for (const field in data.expectedErrors) {
                    const errorLocator = page.locator(`#input-payment-${field} + .invalid-feedback`);
                    await expect(errorLocator).toHaveText(data.expectedErrors[field]);
                }

                const allErrors = page.locator('.invalid-feedback');
                await expect(allErrors).toHaveCount(Object.keys(data.expectedErrors).length);

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