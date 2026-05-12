import { ICustomerRepository } from "./../interfaces/customer.repository";
import { HttpStatus, ResponseError } from "@foundation/lib";
import { ExceptionsConstants } from "@/commons/consts/exceptions";
import { UpdateCustomerDto } from "../dtos/update-customer.dto";
import { Customer } from "../entities";

export class UpdateCustomerUseCase {
  constructor(private customerRepository: ICustomerRepository) {}

  async execute(tenantId: string, customerId: string, data: UpdateCustomerDto): Promise<Customer> {
    await this.checkCustomerExist(tenantId, customerId);

    return this.customerRepository.updateByIdAndTenantId(customerId, tenantId, data);
  }

  private async checkCustomerExist(tenantId: string, customerId: string) {
    const customer = await this.customerRepository.findByIdAndTenantId(customerId, tenantId);

    if (!customer) {
      throw new ResponseError(ExceptionsConstants.CUSTOMER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
  }
}
