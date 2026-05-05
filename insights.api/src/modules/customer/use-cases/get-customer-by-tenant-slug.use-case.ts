import { HttpStatus, ResponseError } from "@foundation/lib";
import { ExceptionsConstants } from "@/commons/consts/exceptions";
import { ITenantRepository } from "@/modules/tenant/interfaces/tenant.repository.interface";
import { ICustomerRepository, PaginatedCustomerByTenantId } from "../interfaces";
import { IUserRepository } from "@/modules/user/interfaces";
import { FilterCustomerDto } from "../dtos";
import { Customer } from "../entities";
import { Tenant } from "@/modules/tenant/entities/tenant";
import { isValidUrlSlug } from "@/utils/valid-url-slug";

export class GetCustomersByTenantSlugUseCase {
  private DEFAULT_PAGE = 1;
  private DEFAULT_USER_LIMIT = 4;

  private readonly populateCustomer = [{ path: "reports" }];

  constructor(
    private readonly tenantRepository: ITenantRepository,
    private readonly customerRepository: ICustomerRepository,
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(urlSlug: string, filter: FilterCustomerDto): Promise<PaginatedCustomerByTenantId> {
    if (!isValidUrlSlug(urlSlug)) {
      throw new ResponseError(ExceptionsConstants.INVALID_URL_SLUG, HttpStatus.BAD_REQUEST);
    }

    const tenant = await this.findTenantByUrlSlug(urlSlug);

    if (!tenant) {
      throw new ResponseError(ExceptionsConstants.TENANT_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    const { page, pageSize } = filter;
    const [customers, count] = await Promise.all([
      this.findCustomerByTenantId(tenant._id, page, pageSize),
      this.countCustomerByTenantId(tenant._id),
    ]);

    const formatedCustomers = await Promise.all(
      customers.map(customer => this.formatCustomers(customer)),
    );

    return { customers: formatedCustomers, count };
  }

  private async formatCustomers(customer: Customer) {
    const { reports, ...restCustomer } = customer;
    const [users, userCount] = await Promise.all([
      this.userRepository.listUserByCustomerId(
        customer._id,
        this.DEFAULT_PAGE,
        this.DEFAULT_USER_LIMIT,
      ),
      this.userRepository.countUserByCustomerId(customer._id),
    ]);

    return {
      ...restCustomer,
      users: { rows: users, count: userCount },
      reports: { rows: reports, count: reports.length },
    };
  }

  private async findTenantByUrlSlug(urlSlug: string): Promise<Tenant> {
    return this.tenantRepository.findBySlug(urlSlug);
  }

  private async findCustomerByTenantId(tenantId: string, page?: number, limit?: number) {
    return this.customerRepository.listAll(
      { tenant: tenantId },
      page,
      limit,
      this.populateCustomer,
    );
  }

  private async countCustomerByTenantId(tenantId: string): Promise<number> {
    return this.customerRepository.count({ tenant: tenantId });
  }
}
