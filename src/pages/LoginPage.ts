import { BasePage } from './BasePage';

/**
 * Models Saucedemo's login page (https://www.saucedemo.com/).
 * All locators use getByTestId(), resolving against the site's
 * `data-test="..."` attribute (configured via `testIdAttribute` in
 * playwright.config.ts) — the one attribute on this site whose sole
 * purpose is being a stable automation hook.
 */
export class LoginPage extends BasePage {
  protected readonly path = '/';

  get usernameInput() {
    return this.page.getByTestId('username');
  }

  get passwordInput() {
    return this.page.getByTestId('password');
  }

  get loginButton() {
    return this.page.getByTestId('login-button');
  }

  get errorMessage() {
    return this.page.getByTestId('error');
  }

  get errorDismissButton() {
    return this.page.getByTestId('error-button');
  }

  /** Perform a full login flow in one call — the common path most tests need. */
  async login(username: string, password: string): Promise<void> {
    await this.fillField(this.usernameInput, username);
    await this.fillField(this.passwordInput, password);
    await this.clickWhenReady(this.loginButton);
  }
}
