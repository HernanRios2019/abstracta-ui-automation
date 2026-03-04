// pages/CartPage.js
const { expect } = require('@playwright/test');
import { faker } from '@faker-js/faker';


class CartPage {
    constructor(page) {
        this.page = page;
        // Locators
        this.deleteButton = page.locator('a.btn.btn-danger');
        this.placeOrderButton = page.locator('button.btn.btn-success');
        this.orderModal = page.locator('#orderModal');
        this.orderModalTitle = page.locator('#orderModalLabel');
        this.orderModalName = page.locator('#name');
        this.orderModalCountry = page.locator('#country');
        this.orderModalCity = page.locator('#city');
        this.orderModalCreditCard = page.locator('#card');
        this.orderModalMonth = page.locator('#month');
        this.orderModalYear = page.locator('#year');
        this.orderModalPurchaseButton = page.getByRole('button', { name: 'Purchase' });
        this.orderModalCancelButton = page.getByRole('button', { name: 'Cancel' });
        this.productTable = page.locator('#tbodyid');
        this.orderModalSuccessButton = page.getByRole('button', { name: 'OK' });
        this.orderModalSuccessTitle = page.locator('.sweet-alert > h2');
        this.orderModalSuccessMessage = page.locator('.sweet-alert > p');
    }

    async fillOrderForm(purchaseData) {
        await this.orderModalName.fill(purchaseData.name);
        await this.orderModalCountry.fill(purchaseData.country);
        await this.orderModalCity.fill(purchaseData.city);
        await this.orderModalCreditCard.fill(purchaseData.creditCard);
        await this.orderModalMonth.fill(purchaseData.month);
        await this.orderModalYear.fill(purchaseData.year);
    }

    async goto() {
        await this.page.goto('/cart.html');
        await expect(this.productTable).toBeVisible();
    }

    async placeOrder() {
        if (await this.placeOrderButton.isVisible()) {
            await this.placeOrderButton.click();
            // Espera técnica para que el contenido cambie (AJAX)
            await this.page.waitForTimeout(2000);
        }
    }

    async purchase() {
        if (await this.orderModalPurchaseButton.isVisible()) {
            await this.orderModalPurchaseButton.click();
            // Espera técnica para que el contenido cambie (AJAX)
            await this.page.waitForTimeout(2000);
        }
    }

    async ok() {
        if (await this.orderModalSuccessButton.isVisible()) {
            await this.orderModalSuccessButton.click();
            // Espera técnica para que el contenido cambie (AJAX)
            await this.page.waitForTimeout(2000);
        }
    }

    async puschaseValidation(purchaseData, price) {
        if (await this.orderModalSuccessButton.isVisible()) {
            await expect(this.orderModalSuccessTitle).toContainText('Thank you for your purchase!');
            await expect(this.orderModalSuccessMessage).toContainText(`Card Number: ${purchaseData.creditCard}`);
            await expect(this.orderModalSuccessMessage).toContainText(`Name: ${purchaseData.name}`);
            await expect(this.orderModalSuccessMessage).toContainText(`Amount: ${price}`);
            // Espera técnica para que el contenido cambie (AJAX)
            await this.page.waitForTimeout(2000);
        }
    }

    async loadPurchaseData() {
        const randomName = faker.person.fullName();
        const randomCountry = faker.location.country();
        const randomCity = faker.location.city();
        const randomCreditCard = faker.finance.creditCardNumber();
        const randomMonth = faker.number.int({ min: 1, max: 12 }).toString();
        const randomYear = faker.number.int({ min: 2026, max: 2030 }).toString();

        const purchaseData = {
            name: randomName,
            country: randomCountry,
            city: randomCity,
            creditCard: randomCreditCard,
            month: randomMonth,
            year: randomYear
        };

        return purchaseData;
    }
}

module.exports = { CartPage };