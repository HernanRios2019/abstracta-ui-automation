# Abstracta UI Automation - OpenCart Project

This repository contains a comprehensive UI testing suite for the **Product Store** platform, developed using **Playwright**. The project implements automation best practices, including the Page Object Model (POM) design pattern and secure sensitive data handling.

---

## 🚀 Key Features

* **Page Object Model (POM)**: Organized structure that decouples selector logic from test scripts, ensuring high maintainability.
* **Data-Driven Testing**: Leverages JSON files and environment variables to parameterize test scenarios.
* **Security with Dotenv**: Manages sensitive credentials (user/password) through environment variables to prevent hardcoding sensitive data in the source code.
* **Robust Locators**: Implementation of Playwright-recommended locators (`getByRole`, `getByText`, `getByPlaceholder`) to ensure stability against DOM changes.
* **Detailed Reporting**: Automatic generation of HTML reports featuring traces and screenshots upon test failure.



---

## 🛠️ Prerequisites

* [Node.js](https://nodejs.org/) (v18 or higher recommended)
* npm (included with Node.js)

---

## 📦 Installation & Setup

1.  **Clone the repository**:
    ```bash
    git clone [https://github.com/HernanRios2019/abstracta-ui-automation.git](https://github.com/HernanRios2019/abstracta-ui-automation.git)
    cd abstracta-ui-automation
    ```

2.  **Install dependencies**:
    Due to potential native compilation issues with recent Node.js versions on macOS, it is recommended to use the ignore-scripts flag:
    ```bash
    npm install --ignore-scripts
    ```

3.  **Install Playwright Browsers**:
    ```bash
    npx playwright install
    ```

4.  **Configure Environment Variables**:
    Create a `.env` file in the project root with your credentials (refer to `.env.example`):
    ```env
    USER_EMAIL=your_email@example.com
    USER_PASSWORD=your_secure_password
    ```

---

## 🧪 Running Tests

To execute all tests in headless mode:
```bash
npx playwright test
```

To run tests using the Playwright UI Mode (Watch mode):
```bash
npx playwright test --ui
```

To view the latest generated HTML report:
```bash
npx playwright show-report
```

---

## 📂 Project Structure
```plain text
├── pages/
│   ├── LoginPage.js        # Lógica de autenticación (POM)
│   ├── ProductPage.js      # Lógica de selección de productos (POM)
│   └── CheckoutPage.js     # Lógica de flujo de compra (POM)
├── tests/
│   └── purchase.spec.js    # Suite de pruebas de flujo de compra
├── .env.example            # Plantilla para variables de entorno
├── playwright.config.js    # Configuración global de Playwright
└── package.json
```

## 📝 Design Decisions

### POM Implementation
Page interactions are encapsulated within specific classes in the pages/ directory. This ensures that if the OpenCart website's design changes, updates are only required in a single file rather than across multiple test scripts.

### Data Security
The project utilizes the dotenv library to load credentials from a local .env file. This file is included in .gitignore to guarantee that sensitive information is never pushed to the public repository.

### Environment Stability
To ensure compatibility with recent Node.js versions (v25+) on macOS, dependency installation is managed by omitting unnecessary native build scripts that are not required for core Playwright functionality.

## 👨‍💻 Author
**Hernán Rios** 
### [![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/rios-hernan/)
### [![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/HernanRios2019)
