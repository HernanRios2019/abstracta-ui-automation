const { expect } = require('@playwright/test');

class HeaderPage {
    constructor(page) {
        this.page = page;
        // Locators
        this.navLogo = page.locator('#nava');
        this.homeLink = page.locator('a[href="index.html"]');
        this.loginLink = page.locator('#login2');
        this.signupLink = page.locator('#signin2');
    }

    async goto() {
        await this.page.goto('/');
        await expect(this.navLogo).toBeVisible();
    }

    async clickLogin() {
        await this.loginLink.click();
    }

    async clickSignup() {
        await this.signupLink.click();
    }


}

module.exports = { HeaderPage };
