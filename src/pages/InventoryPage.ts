import { Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { BurgerMenu } from '../components/BurgerMenu';

export type SortOrder = 'az' | 'za' | 'lohi' | 'hilo';

/**
 * Models the product listing page shown immediately after login
 * (https://www.saucedemo.com/inventory.html).
 */
export class InventoryPage extends BasePage {
  protected readonly path = '/inventory.html';
  readonly menu: BurgerMenu;

  constructor(page: Page) {
    super(page);
    this.menu = new BurgerMenu(page);
  }

  get pageTitle() {
    return this.page.getByTestId('title');
  }

  get sortDropdown() {
    return this.page.getByTestId('product-sort-container');
  }

  get inventoryItems() {
    return this.page.getByTestId('inventory-item');
  }

  get cartLink() {
    return this.page.getByTestId('shopping-cart-link');
  }

  get cartBadge() {
    return this.page.getByTestId('shopping-cart-badge');
  }

  /** Add-to-cart buttons are per-product (data-test="add-to-cart-<slug>"),
   *  so they're matched by an attribute prefix rather than one exact id. */
  addToCartButtonFor(productName: string) {
    return this.page
      .getByTestId('inventory-item')
      .filter({ hasText: productName })
      .getByRole('button', { name: /add to cart/i });
  }

  removeButtonFor(productName: string) {
    return this.page
      .getByTestId('inventory-item')
      .filter({ hasText: productName })
      .getByRole('button', { name: /remove/i });
  }

  async addProductToCart(productName: string): Promise<void> {
    await this.clickWhenReady(this.addToCartButtonFor(productName));
  }

  async sortBy(order: SortOrder): Promise<void> {
    await this.sortDropdown.selectOption(order);
  }

  async getProductNames(): Promise<string[]> {
    return this.page.getByTestId('inventory-item-name').allInnerTexts();
  }

  async getProductPrices(): Promise<number[]> {
    const priceTexts = await this.page.getByTestId('inventory-item-price').allInnerTexts();
    return priceTexts.map((text) => Number(text.replace('$', '')));
  }

  async goToCart(): Promise<void> {
    await this.clickWhenReady(this.cartLink);
  }
}
