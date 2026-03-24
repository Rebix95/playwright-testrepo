import { Page, expect } from '@playwright/test';
import { UserData } from '../fixtures/types';

export class CheckoutPage {
    readonly page: Page;

    constructor(page: Page) {
    this.page = page;
    }

    // Locators
    get firstName() { return this.page.locator('#input-payment-firstname'); }
    get lastName() { return this.page.locator('#input-payment-lastname'); }
    get email() { return this.page.locator('#input-payment-email'); }
    get phone() { return this.page.locator('#input-payment-telephone'); }
    get address() { return this.page.locator('#input-payment-address-1'); }
    get city() { return this.page.locator('#input-payment-city'); }
    get postcode() { return this.page.locator('#input-payment-postcode'); }
    get country() { return this.page.locator('#input-payment-country'); }
    get zone() { return this.page.locator('#input-payment-zone'); }
    get terms() { return this.page.locator('#input-agree'); }
    get continueBtn() { return this.page.getByRole('button', { name: 'Continue ' }); }

    // Actions
    async fillPersonalDetails(data:UserData) {
        await this.firstName.fill(data.firstName);
        await this.lastName.fill(data.lastName);
        await this.email.fill(data.email);
        await this.phone.fill(data.phone);
    }

    async fillBillingAddress(data:UserData) {
        await this.address.fill(data.address);
        await this.city.fill(data.city);
        await this.postcode.fill(data.postcode);
        await this.country.selectOption({ value: data.country });
        await this.zone.selectOption({ value: data.zone });
    }

    async acceptTerms() {
        await this.terms.click();
        await expect(this.terms).toBeChecked();
    }

    async submitForm() {
        await this.continueBtn.click();
    }

    async validationFieldErrors(expectedErrors: Record<string, string>) {
        for (const field in expectedErrors) {
            const errorLocator = this.page.locator(`#input-payment-${field} + .invalid-feedback`);
            await expect(errorLocator).toHaveText(expectedErrors[field]);
        }

        // Check number of errors
        const allErrors = this.page.locator('.invalid-feedback');
        await expect(allErrors).toHaveCount(Object.keys(expectedErrors).length);
    }
}