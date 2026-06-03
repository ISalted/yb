import { Page } from '@playwright/test';
import { TextBoxPage } from './pages/text-box.page';
import { PracticeFormPage } from './pages/practice-form.page';
import { step } from './helpers/step';
import { AppRoute } from './routes';

export class WebClient {
  public readonly textBoxPage: TextBoxPage;
  public readonly practiceFormPage: PracticeFormPage;

  constructor(public readonly page: Page) {
    this.textBoxPage = new TextBoxPage(page);
    this.practiceFormPage = new PracticeFormPage(page);
  }

  @step()
  async goTo(url: AppRoute) {
    await this.page.goto(url);
  }

  async pause() {
    await this.page.pause();
  }
}
