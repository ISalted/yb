import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'https://www.saucedemo.com',
    specPattern: 'e2e/**/*.cy.ts',
    supportFile: 'support/e2e.ts',
    screenshotsFolder: 'screenshots',
    videosFolder: 'videos',
    screenshotOnRunFailure: true,
    video: false,
    retries: {
      runMode: 2,
      openMode: 0,
    },
    // Public (non-secret) test config, read in the browser via Cypress.expose().
    // allowCypressEnv is disabled — Cypress.env() browser access is deprecated.
    allowCypressEnv: false,
    expose: {
      username: 'standard_user',
      password: 'secret_sauce',
      apiUrl: 'https://reqres.in',
      reqresApiKey: 'free_user_3EbKaG3B4vGX1gKXANhRyJNpfWr',
    },
  },
});
