import { UpdateReportCustomerRequestDto } from "./../dtos/update-report-by-customer-request.dto";
import { GetUserReportByUserIdUseCase } from "./../use-cases/get-user-report-by-user-id";
import { Report } from "../entities";
import { IReportService } from "../interfaces";
import { SyncReportType, updateReportRequestType } from "../types";
import { GetReportByTenantSlugUseCase } from "../use-cases/get-report-by-tenant-slug.use-case";
import { GetReportDetailsByIdUseCase } from "../use-cases/get-report-details-by-id.use-case";
import { UpdateReportUseCase } from "../use-cases/update-report.use-case";
import { SynchronizeReportsUseCase } from "../use-cases/synchronize-reports.use-case";
import { AttachReportToDepartmentsUseCase } from "../use-cases/attach-report-to-departments.use-case";
import { GetReportDetailsByCustomerIdUseCase } from "../use-cases/get-report-details-by-customer-id.use-case";
import { GetReportPagesUseCase } from "../use-cases/get-report-pages.use-case";
import { ReportPage } from "@/modules/embed-token/providers/integrations";
import { AttachReportToDepartmentsDto } from "../dtos";
import { UpdateReportByCustomerUseCase } from "../use-cases/update-report-by-customer.use-case";
import util from "util";

util.inspect.defaultOptions.depth = Infinity;

export class ReportService implements IReportService {
  constructor(
    private getReportByTenantSlugUseCase: GetReportByTenantSlugUseCase,
    private getReportDetailsByCustomerIdUseCase: GetReportDetailsByCustomerIdUseCase,
    private getReportDetailsByIdUseCase: GetReportDetailsByIdUseCase,
    private getReportPagesUseCase: GetReportPagesUseCase,
    private getUserReportByUserIdUseCase: GetUserReportByUserIdUseCase,
    private updateReportUseCase: UpdateReportUseCase,
    private updateReportByCustomerUseCase: UpdateReportByCustomerUseCase,
    private synchronizeReportsUseCase: SynchronizeReportsUseCase,
    private attachReportToDepartmentsUseCase: AttachReportToDepartmentsUseCase,
  ) {}
  async getUserReportByUserId(userId: string, urlSlug: string) {
    return this.getUserReportByUserIdUseCase.execute(userId, urlSlug);
  }

  async update(reportId: string, data: updateReportRequestType): Promise<Report> {
    return this.updateReportUseCase.execute(reportId, data);
  }

  updateByCustomer(
    customerId: string,
    departmentId: string,
    reportId: string,
    body: UpdateReportCustomerRequestDto,
  ) {
    return this.updateReportByCustomerUseCase.execute(customerId, departmentId, reportId, body);
  }

  async getReportsByTenantSlug(urlSlug: string): Promise<Report[]> {
    return this.getReportByTenantSlugUseCase.execute(urlSlug);
  }

  async getReportDetailsById(urlSlug: string, reportId: string): Promise<Report> {
    return this.getReportDetailsByIdUseCase.execute(urlSlug, reportId);
  }

  async getReportDetailsByCustomerId(customerId: string): Promise<Report[]> {
    return this.getReportDetailsByCustomerIdUseCase.execute(customerId);
  }

  async getReportPages(reportId: string): Promise<ReportPage[]> {
    return this.getReportPagesUseCase.execute(reportId);
  }

  async synchronizeReports(urlSlug: string): Promise<SyncReportType | null> {
    return this.synchronizeReportsUseCase.execute(urlSlug);
  }

  async attachReportToDepartments(
    customerId: string,
    reportId: string,
    data: AttachReportToDepartmentsDto,
  ): Promise<void> {
    return this.attachReportToDepartmentsUseCase.execute(customerId, reportId, data);
  }
}
