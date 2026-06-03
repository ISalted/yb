import { createCheckers } from 'ts-interface-checker';
import { LoginPage } from '../lib/pages/login.page';
import { InventoryPage } from '../lib/pages/inventory.page';
import { ReqresClient } from '../lib/api/reqres.client';
import { SaucedemoClient } from '../lib/api/saucedemo.client';
import reqresTypes from '../lib/types/reqres.types-ti';

const { ReqresUsersResponse } = createCheckers(reqresTypes);

const loginPage = new LoginPage();
const inventoryPage = new InventoryPage();
const reqresClient = new ReqresClient();
const saucedemoClient = new SaucedemoClient();

describe('Part 1 — Cypress', () => {
  beforeEach(() => {
    loginPage.visit();
  });

  it('Task 1 — should log in, add a product to the cart and verify badge equals 1', () => {
    loginPage.login(Cypress.expose('username'), Cypress.expose('password'));

    inventoryPage.assertLoaded();
    inventoryPage.addItemToCart('sauce-labs-backpack');
    const cartCount = inventoryPage.header.getCartCount();

    cartCount.should('eq', 1);
  });

  it('Task 2 — should validate manifest.json response status and structure', () => {
    // saucedemo is a static React SPA — it makes no XHR/fetch API calls.
    // manifest.json is a real JSON resource served by the app.
    // cy.intercept() only captures Fetch/XHR — Manifest-type requests are not interceptable.
    // We validate it directly via cy.request() to assert status and response structure.
    saucedemoClient.manifest.getManifest().then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('name', 'Swag Labs');
      expect(response.body).to.have.property('icons').and.be.an('array').and.have.length.greaterThan(0);
    });
  });

  it('Task 3 — should get users list and validate response structure', () => {
    reqresClient.users.getUsers(2).then((response) => {
      expect(response.status).to.eq(200);
      ReqresUsersResponse.check(response.body);
    });
  });
});
