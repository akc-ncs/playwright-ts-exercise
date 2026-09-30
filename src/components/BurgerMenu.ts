import { Page } from '@playwright/test';

/**
 * Models Saucedemo's slide-out "burger" menu (top-left icon on every
 * authenticated page) rather than a traditional header nav — this site
 * doesn't have one, so the shared cross-page chrome here is the menu.
 */
export class BurgerMenu {
  constructor(private readonly page: Page) {}

  get openButton() {
    return this.page.getByTestId('open-menu');
  }

  get closeButton() {
    return this.page.getByTestId('close-menu');
  }

  get logoutLink() {
    return this.page.getByTestId('logout-sidebar-link');
  }

  get resetAppStateLink() {
    return this.page.getByTestId('reset-sidebar-link');
  }

  get allItemsLink() {
    return this.page.getByTestId('inventory-sidebar-link');
  }

  async open(): Promise<void> {
    await this.openButton.click();
    await this.logoutLink.waitFor({ state: 'visible' });
  }

  async logout(): Promise<void> {
    await this.open();
    await this.logoutLink.click();
  }

  async resetAppState(): Promise<void> {
    await this.open();
    await this.resetAppStateLink.click();
    await this.closeButton.click();
  }
}
