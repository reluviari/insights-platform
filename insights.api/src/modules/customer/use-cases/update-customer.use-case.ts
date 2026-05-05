import { ICustomerRepository } from "./../interfaces/customer.repository";
import { HttpStatus, ResponseError } from "@foundation/lib";
import { ExceptionsConstants } from "@/commons/consts/exceptions";
import { UpdateCustomerDto } from "../dtos/update-customer.dto";
import { Customer } from "../entities";

export class UpdateCustomerUseCase {
  constructor(private customerRepository: ICustomerRepository) {}

  async execute(customerId: string, data: UpdateCustomerDto): Promise<Customer> {
    await this.checkCustomerExist(customerId);

    return this.customerRepository.update(customerId, data);
  }

  private async checkCustomerExist(customerId: string) {
    const customer = await this.customerRepository.findById(customerId);

    if (!customer) {
      throw new ResponseError(ExceptionsConstants.CUSTOMER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
  }
}
