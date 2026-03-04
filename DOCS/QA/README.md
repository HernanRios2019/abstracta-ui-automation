# Playwright Test Automation Standards

This document outlines the technical standards, best practices, and architectural patterns for developing robust and maintainable end-to-end tests using Playwright in this project. All contributors are expected to adhere to these guidelines.

## 1. Architecture: Page Object Model (POM)

We strictly adhere to the Page Object Model (POM) pattern. This approach enhances test readability, reduces code duplication, and simplifies maintenance by encapsulating UI elements and interactions within dedicated page object classes.

-   **Principle**: Each significant page or major component of the application should have a corresponding Page Object class.
-   **Location**: Page objects are located in the `pages/` directory.
    -   `pages/BasePage.js`: Contains common functionalities and selectors shared across multiple page objects (e.g., header, footer, navigation methods).
    -   `pages/LoginPage.js`: Represents the login page, containing its specific selectors and interaction methods (e.g., `fillUsername()`, `fillPassword()`, `clickLoginButton()`).
-   **Structure of a Page Object**: A page object class should:
    -   Encapsulate selectors for elements on that page using Playwright's `locator()` API.
    -   Define methods that represent user interactions or actions on that page (e.g., `loginAs(user)`, `navigateToProductPage()`).
    -   Return `this` or a new page object instance after an action, allowing for method chaining.
    -   Receive a Playwright `page` object in its constructor to interact with the browser.

```javascript
// pages/LoginPage.js
class LoginPage {
  constructor(page) {
    this.page = page;
    this.usernameInput = page.locator('[data-test-id="username-input"]');
    this.passwordInput = page.locator('[data-test-id="password-input"]');
    this.loginButton = page.locator('[data-test-id="login-button"]');
  }

  async goto() {
    await this.page.goto('/login');
  }

  async login(username, password) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async getErrorMessage() {
    return this.page.locator('[data-test-id="error-message"]').textContent();
  }
}
module.exports = LoginPage;

// tests/login.spec.js
const { test, expect } = require('@playwright/test');
const LoginPage = require('../pages/LoginPage');

test.describe('Login Functionality', () => {
  test('should allow a user to log in successfully', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');
    await expect(page).toHaveURL('/dashboard');
  });
});
```

## 2. Selector Strategy

Robust and resilient selectors are crucial for stable tests. Avoid fragile selectors that rely on presentational styles or volatile attributes. We prioritize the following selector types, in order of preference:

1.  **`data-test-id` Attributes**: This is the preferred method. Developers should add `data-test-id` attributes to relevant DOM elements specifically for testing purposes.
    -   Example: `page.locator('[data-test-id="submit-button"]')`
2.  **Role, Text, or Label**: Playwright's built-in text and role selectors are highly resilient and align with accessibility best practices.
    -   Example: `page.getByRole('button', { name: 'Submit' })`, `page.getByText('Welcome back!')`, `page.getByLabel('Username')`
3.  **CSS Selectors (stable attributes)**: Use stable, unique CSS attributes like `id` (if guaranteed unique) or custom attributes that are unlikely to change.
    -   Example: `page.locator('#uniqueId')`, `page.locator('[name="productName"]')`
4.  **XPath (as a last resort)**: XPath can be powerful but often results in fragile selectors. Use sparingly and only when other options are not viable.

**Forbidden Selectors**:
-   Classes meant for styling (e.g., `.btn-primary`, `.text-red-500`)
-   Tag names alone (e.g., `div`, `span`)
-   Positional selectors (e.g., `:nth-child()`) unless absolutely necessary and well-justified.

**IMPORTANT**: All selectors *must* be defined within Page Object classes, not directly in test files.

## 3. Waiting Strategies

Playwright includes an auto-waiting mechanism for actions and assertions. This means Playwright will automatically wait for elements to be visible, enabled, and stable before performing an action or assertion. Avoid arbitrary, hardcoded waits unless absolutely necessary.

-   **Playwright's Auto-Waiting**: Rely on Playwright's built-in waiting for actions like `click()`, `fill()`, `isVisible()`, `toHaveText()`, etc.
-   **Explicit Waits (when necessary)**:
    -   **Network Requests**: Use `page.waitForResponse()` or `page.waitForRequest()` when waiting for specific API calls to complete.
    -   **Navigation**: Use `page.waitForURL()` to wait for a specific URL change after a navigation action.
    -   **Specific Conditions**: `page.waitForSelector()` (for an element to appear) or `page.waitForFunction()` (for a custom browser-side condition).

**Forbidden**: `page.waitForTimeout(number)` (e.g., `page.waitForTimeout(2000)`) without a strong, documented justification. This makes tests slow and flaky.

## 4. Test Data Management

Test data should be managed externally to ensure reusability and maintainability.

-   **Location**: Store test data in JSON files within a dedicated `test-data/` directory, or use dynamic data generation libraries (e.g., `faker`).
-   **Principles**: `test-data/users.json`, `test-data/products.json`
-   Avoid hardcoding sensitive or frequently changing data directly within test files or page objects.
-   When creating dynamic data, ensure it's unique enough to prevent conflicts and, if possible, cleaned up after tests (though often out of scope for E2E tests themselves).

## 5. Playwright Configuration

The main configuration file is `playwright.config.js` (or `.ts`). This file defines global settings for tests, browsers, reporters, and base URL.

-   **`baseURL`**: Always configure the `baseURL` to allow relative `page.goto()` calls.
-   **Browser Configuration**: Specify the browsers to run tests against (e.g., Chromium, Firefox, WebKit).
-   **Reporters**: Use a suitable reporter (e.g., `html`, `list`, `json`) for CI/CD integration.
-   **Global Setup/Teardown**: Utilize `globalSetup` and `globalTeardown` in `playwright.config.js` for tasks like authentication or setting up a database if needed.

## 6. Reusable Logic and Helper Functions

To promote reusability and keep tests DRY (Don't Repeat Yourself), common helper functions or custom actions should be extracted.

-   **Location**: Create files under `playwright/support/helpers.js` or within custom Playwright fixtures in `playwright/fixtures`.
-   **Examples**: A helper function to generate a random email, a utility to parse a specific API response, or a custom assertion.

```javascript
// playwright/support/helpers.js
function generateRandomEmail() {
  return `user-${Date.now()}@example.com`;
}

module.exports = { generateRandomEmail };

// tests/signup.spec.js
const { test, expect } = require('@playwright/test');
const { generateRandomEmail } = require('../playwright/support/helpers');

test('should allow a user to sign up', async ({ page }) => {
  const randomEmail = generateRandomEmail();
  // ... use randomEmail in the test
});
```

## 7. Validation Commands (Allowed and Recommended)

This section lists the recommended Playwright commands and assertions for building robust tests. These should primarily be used within your Page Object methods, or in test files for high-level assertions after interacting with page objects.

**Navigation & Actions**:
-   `await page.goto(url)`: Navigate to a URL.
-   `await page.locator(selector).click()`: Click an element.
-   `await page.locator(selector).fill(value)`: Fill text into an input field.
-   `await page.locator(selector).press(key)`: Simulate a key press.
-   `await page.locator(selector).check()` / `uncheck()`: Check/uncheck a checkbox or radio button.
-   `await page.locator(selector).selectOption(value)`: Select an option from a `<select>` dropdown.
-   `await page.hover(selector)`: Hover over an element.
-   `await page.locator(selector).isVisible()`: Check if an element is visible.

**Assertions (using `expect` from `@playwright/test`)**:
-   `await expect(page).toHaveURL(url)`: Assert the current URL.
-   `await expect(page).toHaveTitle(title)`: Assert the page title.
-   `await expect(locator).toBeVisible()`: Assert element is visible.
-   `await expect(locator).toBeHidden()`: Assert element is hidden.
-   `await expect(locator).toBeEnabled()`: Assert element is enabled.
-   `await expect(locator).toBeDisabled()`: Assert element is disabled.
-   `await expect(locator).toHaveText(text)`: Assert element contains specific text.
-   `await expect(locator).toContainText(text)`: Assert element contains a substring.
-   `await expect(locator).toHaveValue(value)`: Assert input field has a specific value.
-   `await expect(locator).toBeChecked()`: Assert checkbox/radio button is checked.
-   `await expect(locator).toHaveCount(number)`: Assert number of matching elements.
-   `await expect(response).toBeOK()`: Assert an API response status is OK (2xx).

**Waiting for conditions**:
-   `await page.waitForLoadState('networkidle')`: Wait for network to be idle.
-   `await page.waitForURL(url)`: Wait for the page to navigate to a specific URL.
-   `await page.waitForResponse(urlOrPredicate)`: Wait for a specific API response.
-   `await page.waitForRequest(urlOrPredicate)`: Wait for a specific API request.

## 8. Test Structure and Naming Conventions

-   **Location**: All test files reside in the `tests/` directory and should end with `.spec.js` (or `.spec.ts`).
-   **Grouping**: Use `test.describe()` to group related tests. `test.describe.only()` and `test.only()` are for temporary debugging only and *must not* be committed.
-   **Naming**: Test file names should clearly indicate the feature being tested (e.g., `login.spec.js`, `product-checkout.spec.js`).
-   **Test Names**: Individual `test()` descriptions should be clear, concise, and describe the expected behavior (e.g., `'should display an error message for invalid credentials'`).
-   **Hooks**: Use `test.beforeEach()` for setting up a consistent state before each test (e.g., navigating to a base URL, logging in). Use `test.afterEach()` for cleanup.

## 9. Code Quality and Linting

-   All test code must adhere to the project's ESLint and Prettier configurations.
-   Run `npx eslint . --fix` and `npx prettier --write .` before committing to ensure consistent formatting and catch potential issues.
-   Avoid committing `console.log()` statements or commented-out code. Use Playwright's built-in `test.debug()` or `page.pause()` for debugging.

## 10. Test Execution

-   **Local Execution**: `npx playwright test` to run all tests.
-   **Specific File**: `npx playwright test tests/login.spec.js`
-   **Specific Test**: `npx playwright test tests/login.spec.js --grep "should allow a user to log in"`
-   **Headed Mode**: `npx playwright test --headed` to see the browser UI.
-   **Debugging**: `npx playwright test --debug` to open the Playwright Inspector.
-   **CI/CD**: Tests are automatically run in the CI/CD pipeline, typically in headless mode.

Following these standards ensures a consistent, reliable, and maintainable Playwright test suite that effectively validates the application's functionality.