import { User } from "../entities";

export interface PaginatedUsers {
  users: User[];
  count: number;
}
