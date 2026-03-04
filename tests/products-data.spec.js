// tests/store.spec.js
const { test, expect } = require('@playwright/test');
const { StorePage } = require('../pages/StorePage'); // Importamos el POM
const fs = require('fs');

test.describe('E-commerce Store Automation with POM', () => {
    let storePage;

    // HOOK: Se ejecuta antes de cada test
    test.beforeEach(async ({ page }) => {
        storePage = new StorePage(page);
        await storePage.goto();
    });

    test('Debería extraer productos de dos páginas y guardarlos en JSON', async () => {
        let allProducts = [];

        await test.step('Extraer productos de la Página 1', async () => {
            const p1Products = await storePage.scrapeProducts();
            allProducts = [...allProducts, ...p1Products];
        });

        await test.step('Navegar y extraer productos de la Página 2', async () => {
            await storePage.goToNextPage();
            const p2Products = await storePage.scrapeProducts();
            allProducts = [...allProducts, ...p2Products];
        });

        await test.step('Guardar resultados y validar archivo', async () => {
            expect(allProducts.length).toBeGreaterThan(0);

            const jsonContent = JSON.stringify(allProducts, null, 2);
            fs.writeFileSync('productos_store.json', jsonContent, 'utf-8');

            expect(fs.existsSync('productos_store.json')).toBeTruthy();
            console.log(`Se guardaron ${allProducts.length} productos con éxito.`);
        });
    });
});