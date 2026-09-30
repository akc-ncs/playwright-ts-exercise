import { test, expect } from '../src/fixtures/pages';
import { users } from '../src/data/test-data';

test.describe('Login', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.open();
  });

  test('logs in with valid credentials', { tag: '@smoke' }, async ({ loginPage, page }) => {
    await loginPage.login(users.standard.username, users.standard.password);

    await expect(page).toHaveURL(/inventory\.html/);
  });

  test('rejects a locked-out user with a clear error message', async ({ loginPage }) => {
    await loginPage.login(users.lockedOut.username, users.lockedOut.password);

    await expect(loginPage.errorMessage).toContainText('locked out');
  });

  test('rejects invalid credentials', async ({ loginPage }) => {
    await loginPage.login(users.invalid.username, users.invalid.password);

    await expect(loginPage.errorMessage).toContainText('do not match');
  });

  test('rejects an empty submission', async ({ loginPage }) => {
    await loginPage.login('', '');

    await expect(loginPage.errorMessage).toContainText('Username is required');
  });
});
