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
    env: {
      username: 'standard_user',
      password: 'secret_sauce',
      apiUrl: 'https://reqres.in',
      reqresApiKey: 'free_user_3EbKaG3B4vGX1gKXANhRyJNpfWr',
    },
  },
});
