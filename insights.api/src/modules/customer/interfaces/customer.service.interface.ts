import { CreateCustomerDto, FilterCustomerDto, UpdateCustomerDto } from "../dtos";
import { Customer } from "../entities";
import { PaginatedCustomerByTenantId } from "./paginated-customer-by-tenant-id.interface";

export interface ICustomerService {
  findById(urlSlug: string, customerId: string): Promise<Customer>;
  create(urlSlug: string, data: CreateCustomerDto): Promise<Customer>;
  update(customerId: string, data: UpdateCustomerDto): Promise<Customer>;
  attachReportsToCustomer(customerId: string, reportId: string): Promise<Customer>;
  getCustomerByTenantSlug(
    urlSlug: string,
    filter: FilterCustomerDto,
  ): Promise<PaginatedCustomerByTenantId>;
}
