import { HeaderComponent } from '../components/header.component';

/** Page Object for the Saucedemo products/inventory page. Composes the shared {@link HeaderComponent}. */
export class InventoryPage {
  readonly header = new HeaderComponent();

  readonly selectors = {
    inventoryContainer: '[data-test="inventory-container"]',
    inventoryItem: '.inventory_item',
    itemName: '[data-test="inventory-item-name"]',
    addToCartButton: (itemSlug: string) => `[data-test="add-to-cart-${itemSlug}"]`,
  };

  assertLoaded() {
    cy.get(this.selectors.inventoryContainer).should('be.visible');
  }

  /** Adds a product to the cart by its slug (e.g. `"sauce-labs-backpack"`). */
  addItemToCart(itemSlug: string) {
    cy.get(this.selectors.addToCartButton(itemSlug)).click();
  }
}
