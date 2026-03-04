// tests/store.spec.js
const { test, expect } = require('@playwright/test');
const { StorePage } = require('../pages/StorePage'); // Importamos el POM
const { CartPage } = require('../pages/CartPage'); // Importamos el POM

test.describe('Purchase', () => {
    let storePage;
    let cartPage;
    let price;

    // HOOK: Se ejecuta antes de cada test
    test.beforeEach(async ({ page }) => {
        storePage = new StorePage(page);
        cartPage = new CartPage(page);
        await storePage.goto();
    });

    test('Purchase a product', async () => {

        const purchaseData = await cartPage.loadPurchaseData();

        await test.step('Click on the first product', async () => {
            price = await storePage.scrapeFirstProductPrice();
            console.log(price);
            await storePage.clickFirstProduct();
        });

        await test.step('Click on add to car', async () => {
            await storePage.addToCart();
        });

        await test.step('Navigate to the cart', async () => {
            await cartPage.goto();
        });

        await test.step('Place order', async () => {
            await cartPage.placeOrder();
        });

        await test.step('Fill order form', async () => {
            await cartPage.fillOrderForm(purchaseData);
        });

        await test.step('Purchase', async () => {
            await cartPage.purchase();
        });

        await test.step('Purchase validation', async () => {
            await cartPage.puschaseValidation(purchaseData, price);
        });

        await test.step('Validate navigation to the home page', async () => {
            await cartPage.ok();
            await expect(storePage.navLogo).toBeVisible();
        });
    });

    test.afterEach(async ({ page }, testInfo) => {
        console.log(`Test finished: ${testInfo.title}`);

        if (testInfo.status !== testInfo.expectedStatus) {
            console.log(`Test failed. Final URL: ${page.url()}`);
        }
    });
});