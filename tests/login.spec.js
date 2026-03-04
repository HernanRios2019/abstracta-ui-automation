require('dotenv').config();
const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');
const { HeaderPage } = require('../pages/HeaderPage');

test.describe('Login', () => {
    let loginPage;
    let headerPage;
    const env = process.env;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        headerPage = new HeaderPage(page);
        await headerPage.goto();
    });

    test('Login with valid credentials', async ({ page }) => {
        await headerPage.clickLogin();
        await loginPage.login(env.VALID_USERNAME, env.VALID_PASSWORD);
        await loginPage.validateLogin(env.VALID_USERNAME);
    });

    test('Login with invalid password', async ({ page }) => {
        await headerPage.clickLogin();
        await loginPage.login(env.VALID_USERNAME, env.INVALID_PASSWORD);
        await loginPage.validateInvalidLogin();
    });
});