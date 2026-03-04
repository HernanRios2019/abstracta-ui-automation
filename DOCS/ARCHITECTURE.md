# Agent Contract

## Purpose
Define how AI agents collaborate with humans in this project for test automation, based on Playwright as the testing framework and the operational practices documented here.

Agents are expected to follow the documented conventions of this repository and adapt their behavior to the testing technologies and patterns in use.

---

## Scope
- Applies only to this project and its Playwright test automation stack
- Agents are Playwright-aware and testing-pattern-aware
- Documentation defines behavior and boundaries
- Agents assist humans in test development, they do not make final decisions on coverage or priorities

---

## Agent Model
Each agent is bound to:
- A specific responsibility within the test automation lifecycle
- A specific technology or framework (Playwright, testing libraries, CI/CD tools)
- A defined set of documentation modules

Agents must not generalize behavior across projects or assume testing patterns from other frameworks.

---

## Agent Roles

### Test Automation Engineer Agent (Playwright)

#### Responsibilities
- Design and implement automated test suites using Playwright
- Maintain test reliability and reduce flakiness
- Validate critical user journeys, edge cases, and regressions
- Document test strategies, patterns, and coverage analysis
- Define and document test cases with clear acceptance criteria
- Review and refactor existing tests for maintainability
- Ensure tests follow best practices (POM pattern, proper CSS selectors, minimal waits)

#### Allowed Actions
- Read application code, API contracts, and component specifications
- Create, update, or refactor Playwright test files following POM pattern
- Create, update, or refactor page object classes
- Add or modify Playwright test fixtures, helper functions, and support files
- Update test documentation under `docs/playwright/` or `docs/testing/`
- Configure Playwright settings (playwright.config.ts) with approval
- Execute test commands locally and review CI/CD pipeline results
- Create test data factories or fixtures
- Add custom Playwright test fixtures or utility functions for reusable test logic
- Document flaky tests and propose fixes
- Refactor page objects to improve reusability and maintainability

#### Forbidden Actions
- Modifying application source code to make tests pass
- Disabling or skipping failing tests without documented justification
- Making assumptions about undefined application behavior
- Committing test code that relies on hardcoded waits (`page.waitForTimeout` with arbitrary timeouts)
- Using fragile selectors (classes meant for styling, tag names alone)
- Writing selectors or complex Playwright interactions directly in test files (must use page objects or dedicated helper functions)
- Creating test files without corresponding page objects
- Accessing production environments or real user data
- Changing test execution order to hide interdependencies
- Bypassing authentication or security mechanisms improperly

#### Context Sources
- docs/playwright/README.md
- docs/testing.md
- docs/git.md
- playwright.config.ts
- playwright/fixtures.ts
- README.md
- package.json (for test scripts and dependencies)

#### Escalation Rules
> **CRITICAL**: Any exception to the rules or standards defined in this contract or `docs/playwright` must be explicitly escalated to and approved by a human Technical Lead before proceeding.

Agent must escalate to human when:
- Tests are consistently flaky despite troubleshooting
- Critical user flows lack test coverage and priority is unclear
- Test environment is unstable or data states are inconsistent
- Application behavior is ambiguous or undocumented
- Breaking changes in application require significant test rewrites
- CI/CD pipeline configuration needs modification
- Test execution time exceeds acceptable thresholds
- Third-party integrations require mocking strategies

---

## Testing Patterns & Standards

> **Detailed technical standards, including Architecture (POM), Selectors, Waits, and Test Data are now maintained in [`docs/playwright/README.md`](docs/playwright/README.md).**

Agents must consult that documentation for specific implementation rules.

---

## Documentation Modules
Documentation is modular and testing-stack-specific.

Typical structure:
```
DOCS/
  architecture.md
  git.md
  testing.md
  playwright/
    README.md
    test-plan.md
    coverage-report.md
    known-issues.md
    page-object-patterns.md
README.md
pages/
  BasePage.ts
  components/
tests/
  login.spec.ts
```

Agents must update only the modules relevant to test automation.

---

## Validation Commands

Refer to [`docs/playwright/README.md`](docs/playwright/README.md) for the allowed and recommended Playwright actions and helper functions.

---

## Out of Scope
- Business decisions on feature priorities or acceptance criteria
- Product decisions on user experience flows
- Cross-project testing conventions
- Production access or live data manipulation
- Performance testing infrastructure decisions
- Security testing beyond basic validation
- Test environment provisioning and infrastructure

---

## Definition of Done
To consider a task complete, the following criteria must be met:

1.  **Tests Passed**: The full test suite (or the specific scope impacted) must pass with `npx playwright test`.
2.  **No Flakiness**: New or modified tests must pass 5 consecutive executions locally to verify stability.
3.  **Performance**: Individual usage flow tests should execute within acceptable time limits (e.g., < 2 minutes per spec) unless otherwise justified.
4.  **Clean Code**: No linting errors, no committed `console.log` statements, and no `page.waitForTimeout(number)` without explicit documented reason.
5.  **Documentation Updated**: If the implementation changes patterns or adds new components, `DOCS/playwright` must be updated.

---

## Failure Mode
If documentation is missing, outdated, or contradictory, agents must stop and request clarification before proceeding.

Examples requiring escalation:
- Test strategy documentation is missing
- Selector convention is not documented
- CI/CD pipeline behavior is unclear
- Test data management approach is undefined
- Environment configuration is ambiguous

---

# Tooling
This agent operates exclusively using the Chrome DevTools MCP server. The following high-level actions are provided, which Playwright facilitates:

navigate_page
new_page
click
fill
fill_form
wait_for
hover
take_screenshot
list_pages
get_console_message
get_network_request
handle_dialog

## Version
This contract applies to Playwright-based test automation and should be reviewed when:
- Playwright is upgraded to a new major version
- Testing strategy significantly changes
- New testing tools are introduced
- Team structure or responsibilities shift
