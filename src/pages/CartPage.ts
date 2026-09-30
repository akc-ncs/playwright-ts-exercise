import { BasePage } from './BasePage';

/** Models the cart page (https://www.saucedemo.com/cart.html). */
export class CartPage extends BasePage {
  protected readonly path = '/cart.html';

  get cartItems() {
    return this.page.getByTestId('inventory-item');
  }

  get checkoutButton() {
    return this.page.getByTestId('checkout');
  }

  get continueShoppingButton() {
    return this.page.getByTestId('continue-shopping');
  }

  removeButtonFor(productName: string) {
    return this.cartItems.filter({ hasText: productName }).getByRole('button', { name: /remove/i });
  }

  async removeProduct(productName: string): Promise<void> {
    await this.clickWhenReady(this.removeButtonFor(productName));
  }

  async proceedToCheckout(): Promise<void> {
    await this.clickWhenReady(this.checkoutButton);
  }

  async itemCount(): Promise<number> {
    return this.cartItems.count();
  }
}
