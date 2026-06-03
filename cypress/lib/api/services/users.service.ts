export class UsersService {
  private readonly baseUrl = Cypress.env('apiUrl');
  private readonly apiKey = Cypress.env('reqresApiKey');

  getUsers(page: number): Cypress.Chainable<Cypress.Response<any>> {
    return cy.request({
      method: 'GET',
      url: `${this.baseUrl}/api/users?page=${page}`,
      headers: { 'x-api-key': this.apiKey },
    });
  }
}
