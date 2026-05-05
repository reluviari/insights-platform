import { ICustomerRepository } from "./../interfaces/customer.repository";
import { HttpStatus, ResponseError } from "@foundation/lib";
import { ExceptionsConstants } from "@/commons/consts/exceptions";
import { CreateCustomerDto } from "../dtos";
import { ITenantRepository } from "@/modules/tenant/interfaces/tenant.repository.interface";
import { Customer } from "../entities";

export class CreateCustomerUseCase {
  constructor(
    private customerRepository: ICustomerRepository,
    private tenantRepository: ITenantRepository,
  ) {}

  async execute(urlSlug: string, data: CreateCustomerDto): Promise<Customer> {
    const customer = await this.customerRepository.findByDocument(data?.document);
    if (customer) {
      throw new ResponseError(ExceptionsConstants.CUSTOMER_ALREADY_EXIST, HttpStatus.BAD_REQUEST);
    }

    const tenant = await this.tenantRepository.findBySlug(urlSlug);
    if (!tenant) {
      throw new ResponseError(ExceptionsConstants.TENANT_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    return this.customerRepository.create({ ...data, reports: data.reportIds, tenant: tenant._id });
  }
}
