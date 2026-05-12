import { ReportPage } from "@/modules/embed-token/providers/integrations";
import { Report } from "../entities";
import { SyncReportType, updateReportRequestType } from "../types";
import { AttachReportToDepartmentsDto } from "../dtos";
import { UpdateReportCustomerRequestDto } from "../dtos/update-report-by-customer-request.dto";

export interface IReportService {
  getReportsByTenantSlug(urlSlug: string): Promise<Report[]>;
  getReportDetailsByCustomerId(tenantId: string, customerId: string): Promise<Report[]>;
  getReportPages(tenantId: string, reportId: string): Promise<ReportPage[]>;
  getReportDetailsById(tenantId: string, reportId: string): Promise<Report>;
  getUserReportByUserId(userId: string, urlSlug: string): Promise<{ reports: Report[] }>;
  update(tenantId: string, reportId: string, data: updateReportRequestType): Promise<Report>;
  synchronizeReports(urlSlug: string): Promise<SyncReportType | null>;
  attachReportToDepartments(
    tenantId: string,
    customerId: string,
    reportId: string,
    data: AttachReportToDepartmentsDto,
  ): Promise<void>;
  updateByCustomer(
    tenantId: string,
    customerId: string,
    departmentId: string,
    reportId: string,
    body: UpdateReportCustomerRequestDto,
  );
}
