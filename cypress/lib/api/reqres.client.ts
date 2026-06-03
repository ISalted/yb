import { UsersService } from './services/users.service';

export class ReqresClient {
  public users: UsersService;

  constructor() {
    this.users = new UsersService();
  }
}
