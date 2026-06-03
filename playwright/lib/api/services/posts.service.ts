import { APIRequestContext, APIResponse } from '@playwright/test';

/** Service for the `/posts` resource of the JSONPlaceholder API. */
export class PostsService {
  constructor(private readonly request: APIRequestContext) {}

  /** `GET /posts` — returns the raw response so the test owns status/body assertions. */
  async getPosts(): Promise<APIResponse> {
    return this.request.get('/posts');
  }
}
