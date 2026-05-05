import { ICustomerService } from "./../interfaces";
import { Body, ConnectMongoDB, Method } from "@foundation/lib";
import {
  CreateCustomerDto,
  CustomerParamsDto,
  FilterCustomerDto,
  GetCustomerDto,
  UpdateCustomerDto,
} from "../dtos/";
import { CustomerService } from "../services/customer.service";
import { CreateCustomerUseCase } from "../use-cases/create-curtomer.use-case";
import { Authorize } from "@/modules/auth/strategies/jwt.strategy";
import { customerRepository } from "../repositories/mongo/customer/customer.repository";
import { GetCustomersByTenantSlugUseCase } from "../use-cases/get-customer-by-tenant-slug.use-case";
import { Params, Query, User } from "lib/foundation/methodDecorator";
import { tenantRepository } from "@/modules/tenant/repositories/mongo/tenant/tenant.repository";
import { PaginatedResultsDto } from "@/commons/dtos";
import { userRepository } from "@/modules/user/repositories/mongo/user/user.repository";
import { SessionUser } from "@/commons/interfaces";
import { AttachReportsToCustomerUseCase } from "../use-cases/attach-reports-to-customer.use-case";
import { reportRepository } from "@/modules/report/repositories/mongo/report/report.repository";
import { UpdateCustomerUseCase } from "../use-cases/update-customer.use-case";
import { JwtRoles } from "@/modules/auth/roles/jwt.role";
import { Roles } from "@/modules/auth/roles/enums";
import { GetCustomersByIdUseCase } from "../use-cases/get-customer-by-id.use-case";

export class CustomerController {
  constructor(private customerService: ICustomerService) {}

  @ConnectMongoDB()
  @Authorize()
  @Method()
  public async getCustomerByTenantUrlSlug(
    @Query(FilterCustomerDto) filter: FilterCustomerDto,
    @User { urlSlug }: SessionUser,
  ): Promise<PaginatedResultsDto<GetCustomerDto>> {
    const { page, pageSize } = filter;
    const pageNumber = Number(page ?? 0);

    const { customers, count } = await this.customerService.getCustomerByTenantSlug(
      urlSlug,
      filter,
    );

    return new PaginatedResultsDto<GetCustomerDto>(
      GetCustomerDto.factory(GetCustomerDto, customers),
      count,
      pageNumber,
      pageSize,
    );
  }

  @ConnectMongoDB()
  @Authorize()
  @JwtRoles([Roles.ADMIN])
  @Method()
  public async create(
    @Body(CreateCustomerDto) body: CreateCustomerDto,
    @User { urlSlug }: SessionUser,
  ): Promise<GetCustomerDto> {
    const customer = await this.customerService.create(urlSlug, body);

    return GetCustomerDto.factory(GetCustomerDto, customer);
  }

  @ConnectMongoDB()
  @Authorize()
  @JwtRoles([Roles.ADMIN])
  @Method()
  public async update(
    @Body(UpdateCustomerDto) body: UpdateCustomerDto,
    @Params(CustomerParamsDto) { customerId }: CustomerParamsDto,
  ): Promise<GetCustomerDto> {
    const customer = await this.customerService.update(customerId, body);

    return GetCustomerDto.factory(GetCustomerDto, customer);
  }

  @ConnectMongoDB()
  @Authorize()
  @JwtRoles([Roles.ADMIN])
  @Method()
  public async attachReportsToCustomer(
    @Params(CustomerParamsDto) { customerId, reportId }: CustomerParamsDto,
  ): Promise<GetCustomerDto> {
    const customer = await this.customerService.attachReportsToCustomer(customerId, reportId);

    return GetCustomerDto.factory(GetCustomerDto, customer);
  }

  @ConnectMongoDB()
  @Authorize()
  @JwtRoles([Roles.ADMIN])
  @Method()
  public async findById(
    @Params(CustomerParamsDto) { customerId }: CustomerParamsDto,
    @User { urlSlug }: SessionUser,
  ): Promise<GetCustomerDto> {
    const customer = await this.customerService.findById(urlSlug, customerId);

    return GetCustomerDto.factory(GetCustomerDto, customer);
  }
}

const getCustomersByIdUseCase = new GetCustomersByIdUseCase(tenantRepository, customerRepository);
const createCustomerUseCase = new CreateCustomerUseCase(customerRepository, tenantRepository);
const updateCustomerUseCase = new UpdateCustomerUseCase(customerRepository);
const attachReportsToCustomerUseCase = new AttachReportsToCustomerUseCase(
  customerRepository,
  reportRepository,
);

const getCustomersByTenantSlugUseCase = new GetCustomersByTenantSlugUseCase(
  tenantRepository,
  customerRepository,
  userRepository,
);

const service = new CustomerService(
  getCustomersByIdUseCase,
  createCustomerUseCase,
  updateCustomerUseCase,
  getCustomersByTenantSlugUseCase,
  attachReportsToCustomerUseCase,
);

const controller = new CustomerController(service);

export const findById = controller.findById.bind(controller);
export const create = controller.create.bind(controller);
export const update = controller.update.bind(controller);
export const getCustomerByTenantUrlSlug = controller.getCustomerByTenantUrlSlug.bind(controller);
export const attachReportsToCustomer = controller.attachReportsToCustomer.bind(controller);
