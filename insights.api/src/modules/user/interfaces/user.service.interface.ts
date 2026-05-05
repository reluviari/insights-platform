import { FilterUserDto } from "../dtos";
import { PaginatedUsers } from "./paginated-users.interface";

export interface IUserService {
  listUsersByTenantUrlSlug(urlSlug: string, filter: FilterUserDto): Promise<PaginatedUsers>;
}
