export class HeaderComponent {
  readonly selectors = {
    container: '[data-test="primary-header"]',
    cartLink: '[data-test="shopping-cart-link"]',
    cartBadge: '.shopping_cart_badge',
    menuButton: '[data-test="open-menu"]',
    closeMenuButton: '[data-test="close-menu"]',
    logoutLink: '[data-test="logout-sidebar-link"]',
  };

  getCartCount(): Cypress.Chainable<number> {
    return cy.get(this.selectors.cartBadge).then($el => Number($el.text()));
  }

  goToCart() {
    cy.get(this.selectors.cartLink).click();
  }

  logout() {
    cy.get(this.selectors.menuButton).click();
    cy.get(this.selectors.logoutLink).click();
  }
}
