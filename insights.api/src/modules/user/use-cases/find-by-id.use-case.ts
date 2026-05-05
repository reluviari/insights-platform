import { isValidUrlSlug } from "@/utils/valid-url-slug";
import { User } from "../entities";
import { IUserRepository } from "@/modules/user/interfaces";
import { HttpStatus, ResponseError } from "@foundation/lib";
import { ITenantRepository } from "@/modules/tenant/interfaces/tenant.repository.interface";
import { ExceptionsConstants } from "@/commons/consts/exceptions";
import { ICustomerRepository } from "@/modules/customer/interfaces";
import { PopulateOptions } from "@/commons/interfaces";

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
    private tenantRepository: ITenantRepository,
    private customerRepository: ICustomerRepository,
  ) {}

  async execute(urlSlug: string, customerId: string, userId: string): Promise<User | null> {
    if (!isValidUrlSlug(urlSlug)) {
      throw new ResponseError(ExceptionsConstants.INVALID_URL_SLUG, HttpStatus.BAD_REQUEST);
    }

    const tenant = await this.tenantRepository.findBySlug(urlSlug);

    if (!tenant) {
      throw new ResponseError(ExceptionsConstants.TENANT_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    const customer = await this.customerRepository.findById(customerId);

    if (!customer) {
      throw new ResponseError(ExceptionsConstants.CUSTOMER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    if (customer.tenant !== tenant._id) {
      throw new ResponseError(ExceptionsConstants.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
    }

    const user = await this.userRepository.findUserById(userId, this.populatesUser);

    return user;
  }
}
