import { APIRequestContext } from '@playwright/test';
import { PostsService } from './services/posts.service';

/**
 * Aggregates API service classes behind a shared {@link APIRequestContext}.
 * Tests call typed methods (e.g. `apiClient.posts.getPosts()`) instead of
 * issuing raw HTTP requests.
 */
export class ApiClient {
  public readonly posts: PostsService;

  constructor(request: APIRequestContext) {
    this.posts = new PostsService(request);
  }
}
