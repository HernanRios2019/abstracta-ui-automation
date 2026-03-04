# Project Name

This repository contains the source code for our web application and its end-to-end tests.

## Development

To get started, clone the repository and install dependencies:

```bash
git clone <repo-url>
cd project-name
npm install
```

## Running the Application

```bash
npm start
```

## Testing

We use Playwright for our end-to-end testing needs.

### Running Playwright Tests

To open the Playwright Test UI in interactive mode:

```bash
npx playwright test --ui
```

This will launch a browser window where you can select and run individual Playwright test files and see results interactively.

To run all Playwright tests headlessly (the default for `npx playwright test`):

```bash
npx playwright test
```

You can also run tests in a specific browser (e.g., Chromium):
```bash
npx playwright test --project=chromium
```

### Test Structure

Playwright test files are typically located in the `tests/` directory.
Page Objects and reusable components are often found in a `pages/` directory (e.g., `pages/LoginPage.ts`).
Custom utility functions and test setup can be defined in `playwright.config.ts` or separate helper files (e.g., `test-helpers/`).
The main Playwright configuration is found in `playwright.config.ts` (or `playwright.config.js`).

We adhere strictly to the Page Object Model (POM) pattern for all Playwright tests to ensure maintainability and readability. Refer to `docs/QA/README.md` for our specific Playwright testing standards and conventions.

## Documentation

- `docs/QA/README.md`: Detailed Playwright testing guidelines and best practices.
- `docs/architecture.md`: Project architecture overview.

## How to use this Agent with Gemini for Playwright Tasks

**Important Note:** The current "Agent Contract" provided to this agent is specifically tailored for **Cypress test automation**. While this `README.md` has been updated to reflect Playwright, for this agent to effectively assist with Playwright tasks, its underlying contract (defining its responsibilities, allowed actions, and context sources) would need a significant update to become Playwright-aware.

**Assuming a Playwright-specific contract is in place for a future version of this agent**, you would interact with Gemini as follows to leverage its capabilities for Playwright test development:

1.  **Clearly State the Goal:** Begin your prompt by stating the desired outcome. For example:
    *   "Implement a new Playwright test for the user registration flow."
    *   "Refactor the existing Playwright tests in `tests/product.spec.ts` to use more robust selectors as defined in `docs/QA/README.md`."
    *   "Create a new Page Object for the 'Shopping Cart' page at `pages/ShoppingCartPage.ts`."

2.  **Provide Context and Constraints:**
    *   **Files to Modify/Create:** Specify exact file paths (e.g., `tests/login.spec.ts`, `pages/LoginPage.ts`).
    *   **Relevant Documentation:** Point to specific sections of `docs/QA/README.md` or other relevant documentation for patterns, selector strategies, or test data conventions.
    *   **Application Behavior:** Describe the user journey or application functionality the tests should cover, including URLs, expected text, and interactions.
    *   **Existing Code:** Refer to existing page objects, helper functions, or fixtures that should be leveraged for consistency.

3.  **Specify "Definition of Done":** Remind the agent of the criteria for task completion (e.g., "Ensure all new tests pass 5 consecutive runs to confirm stability, and adhere to `docs/QA/README.md` for clean code.").

**Example Prompt (if the agent were Playwright-aware):**

"Develop a Playwright end-to-end test for the 'Forgot Password' flow.
1.  Create a new test file: `tests/forgotPassword.spec.ts`.
2.  Create a new Page Object: `pages/ForgotPasswordPage.ts` with methods for navigating to the `/forgot-password` URL, entering an email into the input field `id=emailInput`, and clicking the 'Send Reset Link' button `id=sendResetButton`.
3.  The test should verify the following flow:
    *   Navigate to the Forgot Password page.
    *   Enter 'user@example.com' into the email field.
    *   Click the 'Send Reset Link' button.
    *   Assert that a success message containing 'Password reset link sent to your email.' is visible.
4.  Ensure tests follow the POM pattern and robust selector guidelines outlined in `docs/QA/README.md`.
5.  All new tests must pass locally and exhibit no flakiness."

By following these guidelines, Gemini (powered by a Playwright-aware agent, after its contract update) can efficiently assist in developing and maintaining your Playwright test suite.
