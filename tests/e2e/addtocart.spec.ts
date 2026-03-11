import { test, expect } from '@playwright/test';

test('add to cart', async ({ page }) => {
    // Go to product page
    await page.goto('https://ecommerce-playground.lambdatest.io/index.php?route=product/product&path=25&product_id=47');

    // Check title and price 
    await expect(page.getByRole('heading', { name: /HP LP3065/i })).toBeVisible();
    await expect(page.getByRole('heading', { name: '$122.00' })).toBeVisible();

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

    // Check if fly-in cart show product title, quantity and price
    await expect(flyInCart.getByRole('link', { name: /HP LP3065/i }).first()).toBeVisible();

    const quantityCell = flyInCart.getByRole('cell', { name: 'x1' });
    await expect(quantityCell).toBeVisible();

    const priceCell = flyInCart.getByRole('cell', { name: '$122.00' }).first();
    await expect(priceCell).toBeVisible();

    // Open cart overview
    const cartOverviewBtn = flyInCart.getByRole('button', { name: / Edit cart/i});
    await cartOverviewBtn.click();

    // Check if cart overview is visible
    const cartURL = 'https://ecommerce-playground.lambdatest.io/index.php?route=checkout/cart';
    await expect(page).toHaveURL(cartURL);

    const cartOverview = page.locator('#checkout-cart');
    await expect(cartOverview).toBeVisible();

    // Check if cart overview shows product title
    await expect(cartOverview.getByRole('link', { name: /HP LP3065/i }).first()).toBeVisible();

    // Check if cart overview shows product quantity
    const quantityInput = cartOverview.locator('input[name^="quantity"]');
    await expect(quantityInput).toHaveValue('1');

    // Check if cart overview shows correct unit price
    const firstRow = cartOverview.locator('tbody > tr').first();
    const unitPriceCell = firstRow.locator('td').nth(4);
    const totalPriceCell = firstRow.locator('td').nth(5);

    await expect(unitPriceCell).toHaveText('$122.00');

    // Check if cart overview shows correct total price (dynamic)
    const quantityValue = await quantityInput.inputValue();
    const unitPriceText = await unitPriceCell.textContent();
    const totalPriceText = await totalPriceCell.textContent();

    const quantity = parseInt(quantityValue);
    const unitPrice = parseFloat(unitPriceText!.replace('$',''));
    const totalPrice = parseFloat(totalPriceText!.replace('$',''));

    const expectedTotal = quantity * unitPrice;
    await expect(totalPrice).toBe(expectedTotal);

});