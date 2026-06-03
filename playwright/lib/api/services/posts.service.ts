import { APIRequestContext, APIResponse } from '@playwright/test';

export class PostsService {
  constructor(private readonly request: APIRequestContext) {}

  async getPosts(): Promise<APIResponse> {
    return this.request.get('/posts');
  }
}
