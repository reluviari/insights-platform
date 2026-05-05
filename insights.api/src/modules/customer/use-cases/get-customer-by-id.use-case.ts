import { HttpStatus, ResponseError } from "@foundation/lib";
import { ExceptionsConstants } from "@/commons/consts/exceptions";
import { ITenantRepository } from "@/modules/tenant/interfaces/tenant.repository.interface";
import { ICustomerRepository } from "../interfaces";
import { Customer } from "../entities";
import { Tenant } from "@/modules/tenant/entities/tenant";
import { isValidUrlSlug } from "@/utils/valid-url-slug";

export class GetCustomersByIdUseCase {
  constructor(
    private readonly tenantRepository: ITenantRepository,
    private readonly customerRepository: ICustomerRepository,
  ) {}

  async execute(urlSlug: string, customerId: string): Promise<Customer> {
    if (!isValidUrlSlug(urlSlug)) {
      throw new ResponseError(ExceptionsConstants.INVALID_URL_SLUG, HttpStatus.BAD_REQUEST);
    }

    const tenant = await this.findTenantByUrlSlug(urlSlug);

    if (!tenant) {
      throw new ResponseError(ExceptionsConstants.TENANT_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    const customer = await this.findCustomerById(customerId);

    if (!customer) {
      throw new ResponseError(ExceptionsConstants.CUSTOMER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    if (customer.tenant !== tenant._id) {
      throw new ResponseError(ExceptionsConstants.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
    }

    return customer;
  }

  private async findTenantByUrlSlug(urlSlug: string): Promise<Tenant> {
    return this.tenantRepository.findBySlug(urlSlug);
  }

  private async findCustomerById(customerId: string) {
    return this.customerRepository.findById(customerId);
  }
}
