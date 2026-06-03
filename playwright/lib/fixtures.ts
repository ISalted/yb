import { test as base, expect, APIRequestContext } from '@playwright/test';
import { WebClient } from './web-client';
import { ApiClient } from './api/api-client';

type Fixtures = {
  webClient: WebClient;
  apiContext: APIRequestContext;
  apiClient: ApiClient;
};

export const test = base.extend<Fixtures>({
  webClient: async ({ page }, use) => {
    await use(new WebClient(page));
  },

  apiContext: async ({ playwright }, use) => {
    const context = await playwright.request.newContext({
      baseURL: process.env.API_URL ?? 'https://jsonplaceholder.typicode.com',
    });
    await use(context);
    await context.dispose();
  },

  apiClient: async ({ apiContext }, use) => {
    await use(new ApiClient(apiContext));
  },
});

export { expect };
