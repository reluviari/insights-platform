import { ResponseError } from "@foundation/lib";
import { ExceptionsConstants } from "@/commons/consts/exceptions";
import { HttpStatus } from "@foundation/lib";
import { ICustomerRepository } from "@/modules/customer/interfaces";

export async function checkCustomerExist(
  customerId: string,
  customerRepository: ICustomerRepository,
) {
  const customer = await customerRepository.findById(customerId);

  if (!customer) {
    throw new ResponseError(ExceptionsConstants.CUSTOMER_NOT_FOUND, HttpStatus.NOT_FOUND);
  }
  return customer;
}
