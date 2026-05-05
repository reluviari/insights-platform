import { CreateCustomerDto, FilterCustomerDto, UpdateCustomerDto } from "../dtos";
import { Customer } from "../entities";
import { ICustomerService, PaginatedCustomerByTenantId } from "../interfaces";
import { AttachReportsToCustomerUseCase } from "../use-cases/attach-reports-to-customer.use-case";
import { CreateCustomerUseCase } from "../use-cases/create-curtomer.use-case";
import { GetCustomersByIdUseCase } from "../use-cases/get-customer-by-id.use-case";
import { GetCustomersByTenantSlugUseCase } from "../use-cases/get-customer-by-tenant-slug.use-case";
import { UpdateCustomerUseCase } from "../use-cases/update-customer.use-case";

export class CustomerService implements ICustomerService {
  constructor(
    private getCustomersByIdUseCase: GetCustomersByIdUseCase,
    private createCustomerUseCase: CreateCustomerUseCase,
    private updateCustomerUseCase: UpdateCustomerUseCase,
    private getCustomersByTenantSlugUseCase: GetCustomersByTenantSlugUseCase,
    private attachReportsToCustomerUseCase: AttachReportsToCustomerUseCase,
  ) {}

  async findById(urlSlug: string, customerId: string): Promise<Customer> {
    return this.getCustomersByIdUseCase.execute(urlSlug, customerId);
  }

  async update(customerId: string, data: UpdateCustomerDto): Promise<Customer> {
    return this.updateCustomerUseCase.execute(customerId, data);
  }

  async create(urlSlug: string, data: CreateCustomerDto): Promise<Customer> {
    return this.createCustomerUseCase.execute(urlSlug, data);
  }

  async attachReportsToCustomer(customerId: string, reportId: string): Promise<Customer> {
    return this.attachReportsToCustomerUseCase.execute(customerId, reportId);
  }

  async getCustomerByTenantSlug(
    urlSlug: string,
    filter: FilterCustomerDto,
  ): Promise<PaginatedCustomerByTenantId> {
    return this.getCustomersByTenantSlugUseCase.execute(urlSlug, filter);
  }
}
