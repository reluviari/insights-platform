import { HttpStatus } from "@foundation/lib";
import { ExceptionsConstants } from "@/commons/consts/exceptions";
import { ResponseError } from "@foundation/lib";
import { ICustomerRepository } from "@/modules/customer/interfaces";
import { validateObjectId } from "./../../../utils/validate-object-id";

export const checkCustomerExist = async (
  customerRepository: ICustomerRepository,
  customerId: string,
) => {
  validateObjectId(customerId);

  const customer = await customerRepository.findById(customerId);
  if (!customer) {
    throw new ResponseError(ExceptionsConstants.CUSTOMER_NOT_FOUND, HttpStatus.NOT_FOUND);
  }
};
