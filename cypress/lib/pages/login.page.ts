/** Page Object for the Saucedemo login page (`/`). */
export class LoginPage {
  readonly url = '/';

  readonly selectors = {
    username: '[data-test="username"]',
    password: '[data-test="password"]',
    loginButton: '[data-test="login-button"]',
    errorMessage: '[data-test="error"]',
  };

  visit() {
    cy.visit(this.url);
  }

  login(username: string, password: string) {
    cy.get(this.selectors.username).type(username);
    cy.get(this.selectors.password).type(password);
    cy.get(this.selectors.loginButton).click();
  }
}
