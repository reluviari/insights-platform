import { User } from "../entities";
import { IUserRepository } from "@/modules/user/interfaces";
import { HttpStatus, ResponseError } from "@foundation/lib";
import { ExceptionsConstants } from "@/commons/consts/exceptions";
import { ICustomerRepository } from "@/modules/customer/interfaces";
import { PopulateOptions } from "@/commons/interfaces";
import { sameObjectId } from "@/utils/object-id";

export class FindByIdUseCase {
  private populatesUser: PopulateOptions[] = [
    {
      path: "customer",
    },
    {
      path: "departments",
    },
  ];

  constructor(
    private userRepository: IUserRepository,
    private customerRepository: ICustomerRepository,
  ) {}

  async execute(tenantId: string, customerId: string, userId: string): Promise<User | null> {
    const customer = await this.customerRepository.findByIdAndTenantId(customerId, tenantId);

    if (!customer) {
      throw new ResponseError(ExceptionsConstants.CUSTOMER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    const user = await this.userRepository.findUserByIdAndTenantId(
      userId,
      tenantId,
      this.populatesUser,
    );

    if (!user) {
      throw new ResponseError(ExceptionsConstants.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    if (!sameObjectId(user.customer, customerId)) {
      throw new ResponseError(ExceptionsConstants.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    return user;
  }
}
