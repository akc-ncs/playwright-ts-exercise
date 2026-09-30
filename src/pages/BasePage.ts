import { Locator, Page, expect } from '@playwright/test';

/**
 * BasePage centralizes behavior every page object needs: navigation,
 * generic waits, and small interaction helpers. Concrete pages extend
 * this class and add their own locators + page-specific actions.
 *
 * Conventions used across this framework:
 *  - Locators are exposed as `get` accessors (lazy — resolved on use),
 *    never as eagerly-evaluated fields, so they always query the live DOM.
 *  - Locator priority: getByRole > getByLabel > getByTestId > getByText
 *    > CSS as a last resort. Prefer whatever DoTestHere.com exposes most
 *    stably (role/name or a data-testid, if present) over structural CSS.
 *  - Page objects perform actions and expose state; they do NOT contain
 *    `expect` assertions themselves — assertions belong in the tests.
 */
export abstract class BasePage {
  protected readonly page: Page;
  protected abstract readonly path: string; // relative path appended to baseURL

  constructor(page: Page) {
    this.page = page;
  }

  /** Navigate to this page's URL (relative to playwright.config.ts baseURL). */
  async open(): Promise<void> {
    await this.page.goto(this.path);
    await this.waitForPageReady();
  }

  /** Generic readiness check — override in a subclass for a page-specific signal. */
  async waitForPageReady(): Promise<void> {
    await this.page.waitForLoadState('domcontentloaded');
  }

  async title(): Promise<string> {
    return this.page.title();
  }

  async currentUrl(): Promise<string> {
    return this.page.url();
  }

  /** Click with an explicit visibility wait — avoids flaky "element not clickable" errors. */
  protected async clickWhenReady(locator: Locator): Promise<void> {
    await locator.waitFor({ state: 'visible' });
    await locator.click();
  }

  /** Fill a field after clearing it, so repeated runs don't append to stale text. */
  protected async fillField(locator: Locator, value: string): Promise<void> {
    await locator.waitFor({ state: 'visible' });
    await locator.fill(value);
  }

  /** Convenience wrapper so tests can assert page identity without reaching into internals. */
  async expectToBeOnPage(): Promise<void> {
    await expect(this.page).toHaveURL(new RegExp(this.path.replace(/\//g, '\\/')));
  }
}
