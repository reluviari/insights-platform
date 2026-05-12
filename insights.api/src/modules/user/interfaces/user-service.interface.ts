import { CreateUserDto, FilterUserDto, UpdateUserDto } from "../dtos";
import { User } from "../entities";
import { PaginatedUsers } from "./paginated-users.interface";

export interface IUserService {
  findById(tenantId: string, customerId: string, userId: string): Promise<User | null>;
  create(tenantId: string, customerId: string, data: CreateUserDto): Promise<User>;
  update(tenantId: string, userId: string, data: UpdateUserDto): Promise<User>;
  listUsersByTenantUrlSlug(urlSlug: string, filter: FilterUserDto): Promise<PaginatedUsers>;
}
