import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';
import { step } from '../helpers/step';

export interface PracticeFormData {
  firstName?: string;
  lastName?: string;
  email?: string;
  gender?: 'Male' | 'Female' | 'Other';
  mobile?: string;
  address?: string;
}

export const PRACTICE_FORM = {
  modalTitle: 'Thanks for submitting the form',
} as const;

export const ModalLabel = {
  studentName: 'Student Name',
  studentEmail: 'Student Email',
  gender: 'Gender',
  mobile: 'Mobile',
} as const;

export type FieldName = 'firstName' | 'lastName' | 'email' | 'mobile' | 'gender';

export class PracticeFormPage extends BasePage {

  readonly selectors = {
    firstName: '#firstName',
    lastName: '#lastName',
    email: '#userEmail',
    mobile: '#userNumber',
    address: '#currentAddress',
    genderLabel: (gender: string) => `label[for="gender-radio-${gender === 'Male' ? 1 : gender === 'Female' ? 2 : 3}"]`,
    submitButton: '#submit',
    modal: {
      title: '#example-modal-sizes-title-lg',
      closeButton: '#closeLargeModal',
      getRow: (label: string) => `.table-responsive tr td:text("${label}") + td`,
    },
  };

  @step()
  async fillForm(data: PracticeFormData) {
    if (data.firstName !== undefined) await this.page.fill(this.selectors.firstName, data.firstName);
    if (data.lastName !== undefined) await this.page.fill(this.selectors.lastName, data.lastName);
    if (data.email !== undefined) await this.page.fill(this.selectors.email, data.email);
    if (data.gender !== undefined) await this.page.click(this.selectors.genderLabel(data.gender));
    if (data.mobile !== undefined) await this.page.fill(this.selectors.mobile, data.mobile);
    if (data.address !== undefined) await this.page.fill(this.selectors.address, data.address);
  }

  @step()
  async submit() {
    await this.page.click(this.selectors.submitButton);
  }

  /** Confirmation modal title — assert visibility/text via web-first expect() in the test. */
  modalTitle(): Locator {
    return this.page.locator(this.selectors.modal.title);
  }

  /** Value cell of a given modal row — assert via web-first expect() in the test. */
  modalValue(label: string): Locator {
    return this.page.locator(this.selectors.modal.getRow(label));
  }

  /** Submit button — used as a "form is still rendered" guard for negative cases. */
  submitButton(): Locator {
    return this.page.locator(this.selectors.submitButton);
  }

  /** Native HTML5 constraint-validation state of a field (false = field rejected by the browser). */
  @step()
  async isFieldValid(field: FieldName): Promise<boolean> {
    const selector = field === 'gender' ? '#gender-radio-1' : this.selectors[field];
    return this.page.locator(selector).evaluate((el) => (el as HTMLInputElement).validity.valid);
  }

  @step()
  async closeModal() {
    await this.page.click(this.selectors.modal.closeButton);
  }
}
