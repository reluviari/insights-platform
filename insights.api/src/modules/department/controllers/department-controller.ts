import { Body, ConnectMongoDB, Method, Params, Query } from "@foundation/lib";
import { CreateDepartmentUseCase } from "./../use-cases/create-department.use-case";
import { customerRepository } from "./../../customer/repositories/mongo/customer/customer.repository";
import { IDepartmentService } from "../interfaces/department.service.interface";
import {
  CreateDepartmentDto,
  GetDepartmentDetailsDto,
  DepartmentParamsDto,
  FilterDepartmentDto,
  GetDepartmentDto,
  ReportPageDto,
  ReportPageParamsDto,
} from "../dtos";
import { DepartmentService } from "../services/department.service";
import { departmentRepository } from "../repositories/mongo/department/department.repository";
import { Authorize } from "@/modules/auth/strategies/jwt.strategy";
import { ListDepartmentByCustomerIdUseCase } from "../use-cases/list-department-by-customer-id.use-case";
import { PaginatedResultsDto } from "@/commons/dtos";
import { DeleteDepartmentUseCase } from "../use-cases/delete-department.use-case";
import { User } from "lib/foundation/methodDecorator";
import { tenantRepository } from "@/modules/tenant/repositories/mongo/tenant/tenant.repository";
import { SessionUser } from "@/commons/interfaces";
import { Roles } from "@/modules/auth/roles/enums";
import { JwtRoles } from "@/modules/auth/roles/jwt.role";
import { UpdateReportPageUseCase } from "../use-cases/update-department-report-page.use-case";
import { reportRepository } from "@/modules/report/repositories/mongo/report/report.repository";
import { GetDepartmentByIdUseCase } from "../use-cases/get-department-by-id.use-case";

export class DepartmentController {
  constructor(private departmentService: IDepartmentService) {}

  @ConnectMongoDB()
  @Authorize()
  @JwtRoles([Roles.ADMIN])
  @Method()
  public async getDepartmentdetails(
    @Params(DepartmentParamsDto) { customerId, departmentId }: DepartmentParamsDto,
  ): Promise<GetDepartmentDetailsDto> {
    const department = await this.departmentService.getDepartmentById(customerId, departmentId);
    return GetDepartmentDetailsDto.factory(GetDepartmentDetailsDto, department);
  }

  @ConnectMongoDB()
  @Authorize()
  @JwtRoles([Roles.ADMIN])
  @Method()
  public async create(
    @Body(CreateDepartmentDto) body: CreateDepartmentDto,
    @Params(DepartmentParamsDto) { customerId }: DepartmentParamsDto,
  ): Promise<GetDepartmentDetailsDto> {
    const createReport = await this.departmentService.create(customerId, body);
    return GetDepartmentDetailsDto.factory(GetDepartmentDetailsDto, createReport);
  }

  @ConnectMongoDB()
  @Authorize()
  @JwtRoles([Roles.ADMIN])
  @Method()
  public async delete(
    @Params(DepartmentParamsDto) { departmentId }: DepartmentParamsDto,
  ): Promise<void> {
    await this.departmentService.delete(departmentId);
  }

  @ConnectMongoDB()
  @Authorize()
  @JwtRoles([Roles.ADMIN])
  @Method()
  public async updateReportPage(
    @Body() body: ReportPageDto,
    @Params(DepartmentParamsDto) { customerId, departmentId, reportId }: ReportPageParamsDto,
  ): Promise<void> {
    await this.departmentService.updateReportPage(customerId, departmentId, reportId, body);
  }

  @ConnectMongoDB()
  @Authorize()
  @JwtRoles([Roles.ADMIN, Roles.USER])
  @Method()
  public async listByCustomerId(
    @Query(FilterDepartmentDto) filter: FilterDepartmentDto,
    @Params(DepartmentParamsDto) { customerId }: DepartmentParamsDto,
    @User { urlSlug }: SessionUser,
  ): Promise<PaginatedResultsDto<GetDepartmentDto>> {
    const { page, pageSize } = filter;
    const pageNumber = Number(page ?? 0);

    const { departments, count } = await this.departmentService.listByCustomerId(
      customerId,
      urlSlug,
      filter,
    );

    return new PaginatedResultsDto<GetDepartmentDto>(
      GetDepartmentDto.factory(GetDepartmentDto, departments),
      count,
      pageNumber,
      pageSize,
    );
  }
}

const getDepartmentByIdUseCase = new GetDepartmentByIdUseCase(
  departmentRepository,
  customerRepository,
);

const listDepartmentByCustomerIdUseCase = new ListDepartmentByCustomerIdUseCase(
  departmentRepository,
  customerRepository,
  tenantRepository,
);

const createDepartmentUseCase = new CreateDepartmentUseCase(
  departmentRepository,
  customerRepository,
);

const deleteDepartmentUseCase = new DeleteDepartmentUseCase(departmentRepository);
const updateReportPageUseCase = new UpdateReportPageUseCase(
  reportRepository,
  departmentRepository,
  customerRepository,
);

const departmentService = new DepartmentService(
  createDepartmentUseCase,
  deleteDepartmentUseCase,
  listDepartmentByCustomerIdUseCase,
  updateReportPageUseCase,
  getDepartmentByIdUseCase,
);
const departmentController = new DepartmentController(departmentService);

export const getDepartmentdetails =
  departmentController.getDepartmentdetails.bind(departmentController);
export const listByCustomerId = departmentController.listByCustomerId.bind(departmentController);
export const create = departmentController.create.bind(departmentController);
export const destroy = departmentController.delete.bind(departmentController);
export const updateReportPage = departmentController.updateReportPage.bind(departmentController);
