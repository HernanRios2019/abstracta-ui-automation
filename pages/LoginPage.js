const { expect } = require('@playwright/test');

class LoginPage {
    constructor(page) {
        this.page = page;
        // Locators
        this.loginModal = page.locator('#logInModalLabel');
        this.usernameInput = page.locator('#loginusername');
        this.passwordInput = page.locator('#loginpassword');
        this.loginButton = page.locator('button:has-text("Log in")');
        this.usernameLabel = page.locator('#nameofuser');
    }

    async goto() {
        await this.page.goto('/');
        await expect(this.loginModal).toBeVisible();
    }

    async login(username, password) {
        await this.usernameInput.fill(username);
        await this.passwordInput.fill(password);
        await this.loginButton.click();
        // Espera técnica para que el contenido cambie (AJAX)
        await this.page.waitForTimeout(2000);
    }

    async validateLogin(username) {
        await expect(this.usernameLabel).toContainText(username);
    }

    async validateInvalidLogin() {
        await expect(this.loginModal).toBeVisible();
        await expect(this.loginModal).toContainText('Log in');
        await expect(this.usernameLabel).toHaveText('');
    }
}

module.exports = { LoginPage };