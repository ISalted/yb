import { APIRequestContext } from '@playwright/test';
import { PostsService } from './services/posts.service';

export class ApiClient {
  public readonly posts: PostsService;

  constructor(request: APIRequestContext) {
    this.posts = new PostsService(request);
  }
}
