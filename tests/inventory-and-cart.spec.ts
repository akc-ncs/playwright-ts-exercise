import { test, expect } from '../src/fixtures/pages';
import { users } from '../src/data/test-data';

const BACKPACK = 'Sauce Labs Backpack';

test.describe('Inventory and cart', () => {
  test.beforeEach(async ({ loginPage, page }) => {
    await loginPage.open();
    await loginPage.login(users.standard.username, users.standard.password);
    await expect(page).toHaveURL(/inventory\.html/);
  });

  test('adding a product updates the cart badge', { tag: '@smoke' }, async ({ inventoryPage }) => {
    await inventoryPage.addProductToCart(BACKPACK);

    await expect(inventoryPage.cartBadge).toHaveText('1');
  });

  test('sorting price low-to-high orders products ascending', async ({ inventoryPage }) => {
    await inventoryPage.sortBy('lohi');

    const prices = await inventoryPage.getProductPrices();
    const sorted = [...prices].sort((a, b) => a - b);
    expect(prices).toEqual(sorted);
  });

  test('a product added on the inventory page appears in the cart', async ({
    inventoryPage,
    cartPage,
  }) => {
    await inventoryPage.addProductToCart(BACKPACK);
    await inventoryPage.goToCart();

    await expect(cartPage.cartItems).toHaveCount(1);
    await expect(cartPage.cartItems.first()).toContainText(BACKPACK);
  });

  test('removing a product from the cart empties it', async ({ inventoryPage, cartPage }) => {
    await inventoryPage.addProductToCart(BACKPACK);
    await inventoryPage.goToCart();

    await cartPage.removeProduct(BACKPACK);

    expect(await cartPage.itemCount()).toBe(0);
  });
});
