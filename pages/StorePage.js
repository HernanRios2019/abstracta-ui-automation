// pages/StorePage.js
const { expect } = require('@playwright/test');

class StorePage {
    constructor(page) {
        this.page = page;
        // Definición de Locators (Selectores)
        this.navLogo = page.locator('#tbodyid');
        this.productCards = page.locator('.card');
        this.productName = '.hrefch';
        this.productPrice = 'h5';
        this.nextButton = page.locator('#next2');
        this.firstProduct = page.locator('.card').first();
        this.addToCartButton = page.locator('a.btn.btn-success.btn-lg');
    }

    async goto() {
        await this.page.goto('/');
        await expect(this.navLogo).toBeVisible();
    }

    async scrapeProducts() {
        await this.page.waitForSelector('.card');
        const products = await this.productCards.all();
        const pageData = [];

        for (const product of products) {
            const name = await product.locator(this.productName).innerText();
            const priceText = await product.locator(this.productPrice).innerText();
            const link = await product.locator(this.productName).getAttribute('href');

            pageData.push({
                nombre: name.trim(),
                precio: priceText.replace('$', '').trim(),
                url: `https://www.demoblaze.com/${link}`
            });
        }
        return pageData;
    }

    async scrapeFirstProductPrice() {
        await this.page.waitForSelector('.card');
        const priceText = await this.page.locator('.card').first().locator('h5').innerText();
        return priceText.replace('$', '').trim();
    }

    async goToNextPage() {
        if (await this.nextButton.isVisible()) {
            await this.nextButton.click();
            // Espera técnica para que el contenido cambie (AJAX)
            await this.page.waitForTimeout(2000);
        }
    }

    async addToCart() {
        await this.addToCartButton.click();
        // Espera técnica para que el contenido cambie (AJAX)
        await this.page.waitForTimeout(2000);
    }

    async clickFirstProduct() {
        if (await this.firstProduct.isVisible()) {
            await this.firstProduct.click();
            // Espera técnica para que el contenido cambie (AJAX)
            await this.page.waitForTimeout(5000);
        }
    }
}

module.exports = { StorePage };