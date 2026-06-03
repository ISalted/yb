export class ManifestService {
  private readonly baseUrl = 'https://www.saucedemo.com';

  getManifest(): Cypress.Chainable<Cypress.Response<any>> {
    return cy.request({
      method: 'GET',
      url: `${this.baseUrl}/manifest.json`,
    });
  }
}
