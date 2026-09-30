import { BasePage } from './BasePage';

export interface CheckoutInfo {
  firstName: string;
  lastName: string;
  postalCode: string;
}

/**
 * Models Saucedemo's three-step checkout flow as one cohesive page object,
 * since the steps share a single logical journey (info -> overview ->
 * complete) and tests almost always drive through all three together.
 * Split into separate classes only if a future test needs to land on
 * one step in isolation.
 */
export class CheckoutPage extends BasePage {
  protected readonly path = '/checkout-step-one.html';

  // --- Step One: information ---
  get firstNameInput() {
    return this.page.getByTestId('firstName');
  }

  get lastNameInput() {
    return this.page.getByTestId('lastName');
  }

  get postalCodeInput() {
    return this.page.getByTestId('postalCode');
  }

  get continueButton() {
    return this.page.getByTestId('continue');
  }

  get errorMessage() {
    return this.page.getByTestId('error');
  }

  async fillInfo(info: CheckoutInfo): Promise<void> {
    await this.fillField(this.firstNameInput, info.firstName);
    await this.fillField(this.lastNameInput, info.lastName);
    await this.fillField(this.postalCodeInput, info.postalCode);
    await this.clickWhenReady(this.continueButton);
  }

  // --- Step Two: overview ---
  get summarySubtotal() {
    return this.page.getByTestId('subtotal-label');
  }

  get summaryTax() {
    return this.page.getByTestId('tax-label');
  }

  get summaryTotal() {
    return this.page.getByTestId('total-label');
  }

  get finishButton() {
    return this.page.getByTestId('finish');
  }

  async finishOrder(): Promise<void> {
    await this.clickWhenReady(this.finishButton);
  }

  // --- Step Three: complete ---
  get completeHeader() {
    return this.page.getByTestId('complete-header');
  }

  get backToProductsButton() {
    return this.page.getByTestId('back-to-products');
  }
}
