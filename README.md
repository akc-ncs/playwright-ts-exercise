# Saucedemo — Playwright + TypeScript Automation Framework

A Page Object Model (POM) test framework for [Saucedemo](https://www.saucedemo.com/),
covering login, product listing/sorting, cart, and the full checkout flow. Built for
a web automation assessment, with a reusable fixture layer, CI pipeline, and
lint/format tooling.

## Why Saucedemo, and how locators are chosen

Saucedemo exposes a `data-test="..."` attribute on nearly every interactive element —
the one attribute on the page whose sole purpose is being an automation hook (as
opposed to `class`, which is for styling, or `placeholder`, which is UI copy and
breaks on redesign/i18n). This framework:

- registers that convention once, in `playwright.config.ts`:
  ```ts
  use: { testIdAttribute: 'data-test' }
  ```
- then uses `page.getByTestId('...')` everywhere instead of raw CSS attribute
  selectors like `page.locator('[data-test="username"]')`.

> Saucedemo's markup is stable but not guaranteed forever — if a selector below
> stops matching, re-run `npm run codegen` against the live site to confirm the
> current `data-test` value and update the relevant `get` accessor. Nothing else
> in the framework needs to change.

## Project structure

```
├── playwright.config.ts        # Projects, reporters, timeouts, baseURL, testIdAttribute
├── src/
│   ├── pages/                  # One class per page — locators + actions, no assertions
│   │   ├── BasePage.ts         # Shared navigation/wait helpers, extended by every page
│   │   ├── LoginPage.ts
│   │   ├── InventoryPage.ts    # Product listing (post-login landing page)
│   │   ├── CartPage.ts
│   │   └── CheckoutPage.ts     # All three checkout steps (info/overview/complete)
│   ├── components/
│   │   └── BurgerMenu.ts       # Saucedemo's slide-out menu, composed into pages
│   ├── fixtures/
│   │   └── pages.ts            # Injects ready-made page objects into every test
│   └── data/
│       └── test-data.ts        # Saucedemo's published test accounts + checkout data
├── tests/
│   ├── login.spec.ts
│   ├── inventory-and-cart.spec.ts
│   └── checkout.spec.ts
└── .github/workflows/playwright.yml
```

## Setup

```bash
npm install
npx playwright install --with-deps
cp .env.example .env      # adjust BASE_URL / test credentials if needed
```

## Running tests

```bash
npm test                   # all projects (chromium, firefox, webkit, mobile)
npm run test:chromium      # single browser
npm run test:smoke         # only tests tagged @smoke
npm run test:ui            # interactive UI mode — great for debugging locators
npm run test:headed        # see the browser while it runs
npm run report             # open the last HTML report
npm run codegen            # launch Playwright's recorder against Saucedemo
```

## Design decisions worth calling out in review

- **`getByTestId()` everywhere**, backed by `testIdAttribute: 'data-test'` in the
  config — not raw `page.locator('[data-test="..."]')` calls scattered through
  the page objects.
- **Tags via the `test(title, { tag }, fn)` option**, not embedded in the title
  string — keeps titles clean and shows up as real metadata in the HTML report:
  ```ts
  test('logs in with valid credentials', { tag: '@smoke' }, async ({ loginPage }) => { ... });
  ```
- **Page objects never call `expect`.** They expose locators/state; assertions
  live in the spec files, so the same page object supports both positive and
  negative test cases without baking in expectations.
- **Fixtures (`src/fixtures/pages.ts`) construct page objects** — specs never
  write `new LoginPage(page)`; one line of setup, applied consistently.
- **No hard-coded sleeps.** All waits are Playwright's own auto-waiting or
  explicit `waitFor({ state: ... })` on a locator.
- **Per-product locators use `.filter({ hasText })`** (e.g.
  `addToCartButtonFor('Sauce Labs Backpack')`) rather than hardcoding each
  product's slug-specific `data-test` value, since Saucedemo generates those
  per-product (`add-to-cart-sauce-labs-backpack`, etc.) — filtering by visible
  name is both more readable and resilient to a product being renamed/reordered.
- **Real error copy is asserted**, not just "an error is visible" — e.g.
  `toContainText('locked out')` — because Saucedemo's error messages are stable,
  documented, and worth pinning down precisely.

## Extending this framework

1. Add a new page object under `src/pages/`, extending `BasePage`.
2. Register it as a fixture in `src/fixtures/pages.ts`.
3. Write specs against the fixture, not the class directly.
