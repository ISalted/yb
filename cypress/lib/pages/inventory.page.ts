import { HeaderComponent } from '../components/header.component';

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

  addItemToCart(itemSlug: string) {
    cy.get(this.selectors.addToCartButton(itemSlug)).click();
  }
}
