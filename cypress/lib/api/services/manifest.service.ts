/** Service for Saucedemo's `manifest.json` (a real JSON resource, used for network/API validation). */
export class ManifestService {
  private readonly baseUrl = 'https://www.saucedemo.com';

  /** `GET /manifest.json` — returns the raw response so the test owns status/structure assertions. */
  getManifest(): Cypress.Chainable<Cypress.Response<any>> {
    return cy.request({
      method: 'GET',
      url: `${this.baseUrl}/manifest.json`,
    });
  }
}
