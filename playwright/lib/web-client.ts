import { Page } from '@playwright/test';
import { TextBoxPage } from './pages/text-box.page';
import { PracticeFormPage } from './pages/practice-form.page';
import { step } from './helpers/step';
import { AppRoute } from './routes';

/**
 * Single entry point for the UI layer: aggregates every Page Object behind one
 * shared {@link Page}. Tests receive a `WebClient` fixture and reach pages via
 * `webClient.textBoxPage`, `webClient.practiceFormPage`, etc.
 */
export class WebClient {
  public readonly textBoxPage: TextBoxPage;
  public readonly practiceFormPage: PracticeFormPage;

  constructor(public readonly page: Page) {
    this.textBoxPage = new TextBoxPage(page);
    this.practiceFormPage = new PracticeFormPage(page);
  }

  /** Navigate to a known application route (type-checked against {@link AppRoute}). */
  @step()
  async goTo(url: AppRoute) {
    await this.page.goto(url);
  }

  /** Debug helper — pauses execution and opens the Playwright Inspector. Not used in committed tests. */
  async pause() {
    await this.page.pause();
  }
}
