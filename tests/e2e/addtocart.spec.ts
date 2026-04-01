import { test, expect } from '@playwright/test';
import { ProductPage } from '../../pages/ProductPage';

test('add to cart', async ({ page }) => {
    const productPage = new ProductPage(page);

    // Go to product page
    await productPage.openProduct('https://ecommerce-playground.lambdatest.io/index.php?route=product/product&path=25&product_id=47')

    // Check title and price
    await productPage.validateProductDetails('HP LP3065', '$122.00');

    // Add product to cart
    await productPage.addToCartBtn.click();

    // Open fly-in cart
    await productPage.openCart();

    // Check if fly-in cart show product title, quantity and price
    await productPage.validateFlyInCart('HP LP3065', 'x1', '$122.00');

    // Open cart overview
    await productPage.cartOverviewBtn.click();


    // Validate cart overview
    await productPage.validateCartOverview('HP LP3065', '1');

    // -----------------------------------------------------------------------------------------------

    // // Check if cart overview is visible
    // const cartURL = 'https://ecommerce-playground.lambdatest.io/index.php?route=checkout/cart';
    // await expect(page).toHaveURL(cartURL);

    // const cartOverview = page.locator('#checkout-cart');
    // await expect(cartOverview).toBeVisible();

    // // Check if cart overview shows product title
    // await expect(cartOverview.getByRole('link', { name: /HP LP3065/i }).first()).toBeVisible();

    // // Check if cart overview shows product quantity
    // const quantityInput = cartOverview.locator('input[name^="quantity"]');
    // await expect(quantityInput).toHaveValue('1');

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