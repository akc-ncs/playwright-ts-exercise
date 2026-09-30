import { test, expect } from '../src/fixtures/pages';
import { users, buildCheckoutInfo } from '../src/data/test-data';

const BACKPACK = 'Sauce Labs Backpack';

test.describe('Checkout', () => {
  test.beforeEach(async ({ loginPage, inventoryPage, page }) => {
    await loginPage.open();
    await loginPage.login(users.standard.username, users.standard.password);
    await expect(page).toHaveURL(/inventory\.html/);

    await inventoryPage.addProductToCart(BACKPACK);
    await inventoryPage.goToCart();
  });

  test(
    'completes a full purchase end to end',
    { tag: '@smoke' },
    async ({ cartPage, checkoutPage, page }) => {
      await cartPage.proceedToCheckout();
      await expect(page).toHaveURL(/checkout-step-one\.html/);

      await checkoutPage.fillInfo(buildCheckoutInfo());
      await expect(page).toHaveURL(/checkout-step-two\.html/);

      await expect(checkoutPage.summaryTotal).toBeVisible();
      await checkoutPage.finishOrder();

      await expect(page).toHaveURL(/checkout-complete\.html/);
      await expect(checkoutPage.completeHeader).toContainText('Thank you for your order');
    },
  );

  test('blocks checkout when required info is missing', async ({ cartPage, checkoutPage }) => {
    await cartPage.proceedToCheckout();

    await checkoutPage.continueButton.click();

    await expect(checkoutPage.errorMessage).toContainText('First Name is required');
  });
});
