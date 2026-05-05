import { ConnectMongoDB, Method } from "@foundation/lib";
import { ReportService } from "../services/report.service";
import { IReportService } from "../interfaces";
import { GetReportByTenantSlugUseCase } from "../use-cases/get-report-by-tenant-slug.use-case";
import { Authorize } from "@/modules/auth/strategies/jwt.strategy";
import {
  GetReportDetailsDto,
  GetReportDto,
  GetUserReportDto,
  ReportParamsDto,
  UpdateReportRequestDto,
  UpdateReportResponseDto,
  AttachReportToDepartmentsDto,
  CustomerReportParamsDto,
  SyncReportDto,
  GetReportDetailsByCustomerDto,
  GetReportPageDto,
} from "../dtos";
import { Body, Params, User } from "lib/foundation/methodDecorator";
import { reportRepository } from "../repositories/mongo/report/report.repository";
import { tenantRepository } from "@/modules/tenant/repositories/mongo/tenant/tenant.repository";
import { GetReportDetailsByIdUseCase } from "../use-cases/get-report-details-by-id.use-case";
import { reportFilterRepository } from "@/modules/report-filter/repositories/mongo/report-filter/report-filter.repository";
import { SessionUser } from "@/commons/interfaces";
import { userRepository } from "@/modules/user/repositories/mongo/user/user.repository";
import { GetUserReportByUserIdUseCase } from "../use-cases/get-user-report-by-user-id";
import { UpdateReportUseCase } from "../use-cases/update-report.use-case";

import { departmentRepository } from "@/modules/department/repositories/mongo/department/department.repository";
import { customerRepository } from "@/modules/customer/repositories/mongo/customer/customer.repository";
import { PBIReportsIntegration } from "../providers/integrations";
import { SynchronizeReportsUseCase } from "../use-cases/synchronize-reports.use-case";
import { JwtRoles } from "@/modules/auth/roles/jwt.role";
import { Roles } from "@/modules/auth/roles/enums";
import { AttachReportToDepartmentsUseCase } from "../use-cases/attach-report-to-departments.use-case";
import { GetReportDetailsByCustomerIdUseCase } from "../use-cases/get-report-details-by-customer-id.use-case";
import { GetReportPagesUseCase } from "../use-cases/get-report-pages.use-case";
import { UpdateReportCustomerRequestDto } from "../dtos/update-report-by-customer-request.dto";
import { UpdateReportByCustomerUseCase } from "../use-cases/update-report-by-customer.use-case";

export class ReportController {
  constructor(private reportService: IReportService) {}

  @ConnectMongoDB()
  @Authorize()
  @Method()
  public async getReportsByTenantSlug(@User { urlSlug }: SessionUser): Promise<GetReportDto> {
    const reportsByTenant = await this.reportService.getReportsByTenantSlug(urlSlug);

    return GetReportDto.factory(GetReportDto, reportsByTenant);
  }

  @ConnectMongoDB()
  @Authorize()
  @JwtRoles([Roles.ADMIN])
  @Method()
  public async getReportDetailsById(
    @Params(ReportParamsDto) { reportId }: ReportParamsDto,
    @User { urlSlug }: SessionUser,
  ): Promise<GetReportDetailsDto> {
    const report = await this.reportService.getReportDetailsById(urlSlug, reportId);

    return GetReportDetailsDto.factory(GetReportDetailsDto, report);
  }

  @ConnectMongoDB()
  @Authorize()
  @JwtRoles([Roles.ADMIN])
  @Method()
  public async listReportDetailsByCustomerId(
    @Params(CustomerReportParamsDto) { customerId }: CustomerReportParamsDto,
  ): Promise<GetReportDetailsByCustomerDto> {
    const reports = await this.reportService.getReportDetailsByCustomerId(customerId);

    return GetReportDetailsByCustomerDto.factory(GetReportDetailsByCustomerDto, reports);
  }

  @ConnectMongoDB()
  @Authorize()
  @JwtRoles([Roles.ADMIN])
  @Method()
  public async listReportPages(
    @Params(ReportParamsDto) { reportId }: ReportParamsDto,
  ): Promise<GetReportPageDto> {
    const pages = await this.reportService.getReportPages(reportId);

    return GetReportPageDto.factory(GetReportPageDto, pages);
  }

  @ConnectMongoDB()
  @Authorize()
  @Method()
  public async update(
    @Body(UpdateReportRequestDto) body: UpdateReportRequestDto,
    @Params(ReportParamsDto) { reportId }: ReportParamsDto,
  ): Promise<UpdateReportResponseDto> {
    const updatedReport = await this.reportService.update(reportId, body);

    return UpdateReportResponseDto.factory(UpdateReportResponseDto, {
      data: updatedReport,
    });
  }

  @ConnectMongoDB()
  @Authorize()
  @Method()
  public async updateByCustomer(
    @Body(UpdateReportCustomerRequestDto) body: UpdateReportCustomerRequestDto,
    @Params(ReportParamsDto) { reportId, customerId, departmentId }: ReportParamsDto,
  ): Promise<void> {
    return this.reportService.updateByCustomer(customerId, departmentId, reportId, body);
  }

  @ConnectMongoDB()
  @Authorize()
  @JwtRoles([Roles.USER, Roles.ADMIN])
  @Method()
  public async userReport(@User { id, urlSlug }: SessionUser): Promise<GetUserReportDto | null> {
    const userReport = await this.reportService.getUserReportByUserId(id, urlSlug);

    return GetUserReportDto.factory(GetUserReportDto, userReport);
  }

  @ConnectMongoDB()
  @Authorize()
  @JwtRoles([Roles.ADMIN])
  @Method()
  public async synchronizeReport(@User { urlSlug }: SessionUser): Promise<SyncReportDto | null> {
    const syncReports = await this.reportService.synchronizeReports(urlSlug);

    return SyncReportDto.factory(SyncReportDto, syncReports);
  }

  @ConnectMongoDB()
  @Authorize()
  @JwtRoles([Roles.ADMIN])
  @Method()
  public async attachReportToDepartments(
    @Params(ReportParamsDto) { reportId, customerId }: ReportParamsDto,
    @Body(AttachReportToDepartmentsDto) data: AttachReportToDepartmentsDto,
  ) {
    return this.reportService.attachReportToDepartments(customerId, reportId, data);
  }
}

const reportIntegration = new PBIReportsIntegration();
const getUserReportByUserIdUseCase = new GetUserReportByUserIdUseCase(
  userRepository,
  departmentRepository,
  customerRepository,
  tenantRepository,
);

const updateReportUseCase = new UpdateReportUseCase(reportRepository);

const updateReportByCustomerUseCase = new UpdateReportByCustomerUseCase(
  reportFilterRepository,
  customerRepository,
  reportRepository,
  departmentRepository,
);

const getReportByTenantSlugUseCase = new GetReportByTenantSlugUseCase(
  reportRepository,
  tenantRepository,
);

const getReportDetailsByCustomerIdUseCase = new GetReportDetailsByCustomerIdUseCase(
  reportFilterRepository,
  customerRepository,
  departmentRepository,
  reportIntegration,
);

const getReportDetailsByIdUseCase = new GetReportDetailsByIdUseCase(
  reportRepository,
  reportFilterRepository,
  tenantRepository,
);

const getReportPagesUseCase = new GetReportPagesUseCase(reportRepository, reportIntegration);

const synchronizeReportsUseCase = new SynchronizeReportsUseCase(
  tenantRepository,
  reportRepository,
  reportIntegration,
);

const attachReportToDepartmentsUseCase = new AttachReportToDepartmentsUseCase(
  customerRepository,
  reportRepository,
  departmentRepository,
  reportFilterRepository,
);

const service = new ReportService(
  getReportByTenantSlugUseCase,
  getReportDetailsByCustomerIdUseCase,
  getReportDetailsByIdUseCase,
  getReportPagesUseCase,
  getUserReportByUserIdUseCase,
  updateReportUseCase,
  updateReportByCustomerUseCase,
  synchronizeReportsUseCase,
  attachReportToDepartmentsUseCase,
);
const controller = new ReportController(service);

export const getReportsByTenantSlug = controller.getReportsByTenantSlug.bind(controller);
export const getReportDetailsById = controller.getReportDetailsById.bind(controller);
export const listReportDetailsByCustomerId =
  controller.listReportDetailsByCustomerId.bind(controller);
export const listReportPages = controller.listReportPages.bind(controller);
export const synchronizeReport = controller.synchronizeReport.bind(controller);
export const userReport = controller.userReport.bind(controller);
export const update = controller.update.bind(controller);
export const updateByCustomer = controller.updateByCustomer.bind(controller);
export const attachReportToDepartments = controller.attachReportToDepartments.bind(controller);
