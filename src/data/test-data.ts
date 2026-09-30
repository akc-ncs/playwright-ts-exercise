import type { CheckoutInfo } from '../pages/CheckoutPage';

/**
 * Saucedemo's published test accounts — all use the same password and are
 * publicly documented on the login page itself, so committing them here
 * (unlike real secrets) is expected practice for this site.
 */
export const users = {
  standard: { username: 'standard_user', password: 'secret_sauce' },
  lockedOut: { username: 'locked_out_user', password: 'secret_sauce' },
  problem: { username: 'problem_user', password: 'secret_sauce' },
  performanceGlitch: { username: 'performance_glitch_user', password: 'secret_sauce' },
  invalid: { username: 'no_such_user', password: 'wrong_password' },
};

export function buildCheckoutInfo(overrides: Partial<CheckoutInfo> = {}): CheckoutInfo {
  return {
    firstName: 'Ada',
    lastName: 'Lovelace',
    postalCode: '3000',
    ...overrides,
  };
}
