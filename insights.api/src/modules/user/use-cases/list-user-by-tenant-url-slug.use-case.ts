import { ITenantRepository } from "@/modules/tenant/interfaces/tenant.repository.interface";
import { IUserRepository, PaginatedUsers } from "@/modules/user/interfaces";
import { HttpStatus, ResponseError } from "@foundation/lib";
import { ExceptionsConstants } from "@/commons/consts/exceptions";
import { FilterUserDto } from "../dtos";
import { isValidUrlSlug } from "@/utils/valid-url-slug";

export class ListUserByTenantUrlSlugUseCase {
  private populateUser = [{ path: "departments" }, { path: "customer" }];

  constructor(
    private userRepository: IUserRepository,
    private tenantRepository: ITenantRepository,
  ) {}

  async execute(urlSlug: string, filter: FilterUserDto): Promise<PaginatedUsers> {
    if (!isValidUrlSlug(urlSlug)) {
      throw new ResponseError(ExceptionsConstants.INVALID_URL_SLUG, HttpStatus.BAD_REQUEST);
    }

    const tenant = await this.tenantRepository.findBySlug(urlSlug);

    if (!tenant) {
      throw new ResponseError(ExceptionsConstants.TENANT_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    const { page, pageSize, name } = filter;

    const [users, count] = await Promise.all([
      this.userRepository.listUserByTenantId(
        { tenant: tenant._id, name },
        page,
        pageSize,
        this.populateUser,
      ),
      this.userRepository.countUserByTenantId({ tenant: tenant._id, name }),
    ]);

    return { users, count };
  }
}
