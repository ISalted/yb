import { UsersService } from './services/users.service';

/** API client for the Reqres service. Aggregates resource-specific services. */
export class ReqresClient {
  public users: UsersService;

  constructor() {
    this.users = new UsersService();
  }
}
