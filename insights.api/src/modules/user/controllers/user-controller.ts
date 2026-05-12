import { UpdateUserParamsDto } from "./../dtos/update-user-params.dto";
import { UpdateUserUseCase } from "./../use-cases/update-user.use-case";
import { Authorize } from "@/modules/auth/strategies/jwt.strategy";
import { Body, ConnectMongoDB, Method, Params, Query } from "@foundation/lib";
import { IUserService } from "../interfaces/user-service.interface";
import { UserService } from "../services/user.service";
import { CreateUserUseCase } from "../use-cases/create-user.use-case";
import { userRepository } from "../repositories/mongo/user/user.repository";
import {
  CreateUserDto,
  UpdateUserDto,
  GetUserDetailsDto,
  GetUserDto,
  UserParamsDto,
} from "../dtos";
import { tenantRepository } from "@/modules/tenant/repositories/mongo/tenant/tenant.repository";
import { departmentRepository } from "@/modules/department/repositories/mongo/department/department.repository";
import { customerRepository } from "@/modules/customer/repositories/mongo/customer/customer.repository";
import { JwtRoles } from "@/modules/auth/roles/jwt.role";
import { Roles } from "@/modules/auth/roles/enums";
import { FilterUserDto } from "../dtos";
import { User } from "lib/foundation/methodDecorator";
import { PaginatedResultsDto } from "@/commons/dtos";
import { ListUserByTenantUrlSlugUseCase } from "../use-cases/list-user-by-tenant-url-slug.use-case";
import { SessionUser } from "@/commons/interfaces";
import { FindByIdUseCase } from "../use-cases/find-by-id.use-case";

export class UserController {
  constructor(private userService: IUserService) {}

  @ConnectMongoDB()
  @Authorize()
  @JwtRoles([Roles.ADMIN])
  @Method()
  public async findById(
    @Params(UserParamsDto) { customerId, userId }: UserParamsDto,
    @User { tenantId }: SessionUser,
  ): Promise<GetUserDetailsDto> {
    const user = await this.userService.findById(tenantId, customerId, userId);

    return GetUserDetailsDto.factory(GetUserDetailsDto, user);
  }

  @ConnectMongoDB()
  @Authorize()
  @JwtRoles([Roles.ADMIN])
  @Method()
  async create(
    @Body(CreateUserDto) body: CreateUserDto,
    @Params(UserParamsDto) { customerId }: UserParamsDto,
    @User { tenantId }: SessionUser,
  ): Promise<GetUserDto> {
    const user = await this.userService.create(tenantId, customerId, body);

    return GetUserDto.factory(GetUserDto, user);
  }

  @ConnectMongoDB()
  @Authorize()
  @JwtRoles([Roles.ADMIN])
  @Method()
  async update(
    @Body(UpdateUserDto) body: UpdateUserDto,
    @Params(UpdateUserParamsDto) { userId }: UpdateUserParamsDto,
    @User { tenantId }: SessionUser,
  ): Promise<GetUserDto> {
    const user = await this.userService.update(tenantId, userId, body);
    return GetUserDto.factory(GetUserDto, user);
  }

  @ConnectMongoDB()
  @Authorize()
  @JwtRoles([Roles.ADMIN])
  @Method()
  public async listUsersByTenantSlug(
    @Query(FilterUserDto) filter: FilterUserDto,
    @User { urlSlug }: SessionUser,
  ): Promise<PaginatedResultsDto<GetUserDetailsDto>> {
    const { page, pageSize } = filter;
    const pageNumber = Number(page ?? 0);

    const { users, count } = await this.userService.listUsersByTenantUrlSlug(urlSlug, filter);

    return new PaginatedResultsDto<GetUserDetailsDto>(
      GetUserDetailsDto.factory(GetUserDetailsDto, users),
      count,
      pageNumber,
      pageSize,
    );
  }
}

const findByIdUseCase = new FindByIdUseCase(userRepository, customerRepository);

const listUserByTenantUrlSlugUseCase = new ListUserByTenantUrlSlugUseCase(
  userRepository,
  tenantRepository,
);

const createUserUseCase = new CreateUserUseCase(
  userRepository,
  departmentRepository,
  customerRepository,
);

const updateUserUseCase = new UpdateUserUseCase(userRepository, departmentRepository);

const service = new UserService(
  createUserUseCase,
  updateUserUseCase,
  listUserByTenantUrlSlugUseCase,
  findByIdUseCase,
);

const controller = new UserController(service);

export const listUsersByTenantSlug = controller.listUsersByTenantSlug.bind(controller);
export const create = controller.create.bind(controller);
export const update = controller.update.bind(controller);
export const findById = controller.findById.bind(controller);
