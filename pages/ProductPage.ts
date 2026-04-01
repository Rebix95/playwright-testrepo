import { Page, expect } from '@playwright/test';

export class ProductPage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    // Locators
    get addToCartBtn() {
        return this.page.getByRole('button', { name: 'Add to Cart' });
    }

    get flyInCart() {
        return this.page.locator('#cart-total-drawer');
    }

    get cartBtn() {
        return this.page.locator('#entry_217825 a.cart');
    }

    get checkoutBtn() {
        return this.page.getByRole('button', { name: ' Checkout' });
    }

    get notificationBox() {
        return this.page.locator('#notification-box-top');
    }

    get cartOverviewBtn() {
        return this.flyInCart.getByRole('button', { name: / Edit cart/i});
    }

    get cartOverview() {
        return this.page.locator('#checkout-cart');
    }

    get quantityInput() {
        return this.cartOverview.locator('input[name^="quantity"]');
    }

    // Actions
    async openProduct(url: string) {
        await this.page.goto(url);
    }

    async addToCart() {
        await this.addToCartBtn.click();
        await this.page.locator('#notification-box-top').waitFor({ state: 'hidden' });
    }

    async openCart() {
        await this.cartBtn.click();
        await expect(this.flyInCart).toBeVisible();
    }

    async proceedToCheckout() {
        await this.checkoutBtn.click();
    }

    async validationProductInCart(productName: string) {
        const product = this.page.locator('#cart-total-drawer').getByText(productName);
        await expect(product).toBeVisible;
    }

    async validateProductDetails(productName: string, price: string) {
        await this.notificationBox.waitFor({ state: 'hidden' });
        await expect(this.page.getByRole('heading', { name: productName })).toBeVisible();
        await expect(this.page.getByRole('heading', { name: price })).toBeVisible();
    }

    async validateFlyInCart(name: string, quantity: string, price: string) {
        await expect(this.flyInCart.getByRole('link', { name: name }).first()).toBeVisible();
        await expect(this.flyInCart.getByRole('cell', { name: quantity })).toBeVisible();
        await expect(this.flyInCart.getByRole('cell', { name: price }).first()).toBeVisible();
    }

    async validateCartOverview(productName: string, quantity: string) {
        const cartURL = 'https://ecommerce-playground.lambdatest.io/index.php?route=checkout/cart';
        await expect(this.page).toHaveURL(cartURL);

        await expect(this.cartOverview).toBeVisible();

        await expect(this.cartOverview.getByRole('link', { name: productName }).first()).toBeVisible();

        await expect(this.quantityInput).toHaveValue(quantity);

        const firstRow = this.cartOverview.locator('tbody > tr').first();
        const unitPriceCell = firstRow.locator('td').nth(4);
        const totalPriceCell = firstRow.locator('td').nth(5);

        await expect(unitPriceCell).toHaveText('$122.00');
    }
}