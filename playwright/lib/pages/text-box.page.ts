import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';
import { step } from '../helpers/step';

export interface TextBoxFormData {
  fullName: string;
  email: string;
  currentAddress: string;
  permanentAddress: string;
}

export class TextBoxPage extends BasePage {
  readonly selectors = {
    fullName: '#userName',
    email: '#userEmail',
    currentAddress: '#currentAddress',
    permanentAddress: '#permanentAddress',
    submitButton: '#submit',
    output: {
      name: '#output #name',
      email: '#output #email',
      currentAddress: '#output #currentAddress',
      permanentAddress: '#output #permanentAddress',
    },
  };

  @step()
  async fillForm(data: TextBoxFormData) {
    await this.page.fill(this.selectors.fullName, data.fullName);
    await this.page.fill(this.selectors.email, data.email);
    await this.page.fill(this.selectors.currentAddress, data.currentAddress);
    await this.page.fill(this.selectors.permanentAddress, data.permanentAddress);
  }

  @step()
  async submit() {
    await this.page.click(this.selectors.submitButton);
  }

  /** Output rows — assert via web-first expect(locator).toContainText() in the test. */
  outputName(): Locator {
    return this.page.locator(this.selectors.output.name);
  }

  outputEmail(): Locator {
    return this.page.locator(this.selectors.output.email);
  }

  outputCurrentAddress(): Locator {
    return this.page.locator(this.selectors.output.currentAddress);
  }

  outputPermanentAddress(): Locator {
    return this.page.locator(this.selectors.output.permanentAddress);
  }
}
