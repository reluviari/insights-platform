import { ExceptionsConstants } from "@/commons/consts/exceptions";
import { HttpStatus, ResponseError } from "@foundation/lib";
import { ITenantRepository } from "@/modules/tenant/interfaces/tenant.repository.interface";
import { IReportIntegration, IReportRepository } from "../interfaces";
import { isValidUrlSlug } from "@/utils/valid-url-slug";
import { SyncReportType } from "../types";

export class SynchronizeReportsUseCase {
  constructor(
    private tenantRepository: ITenantRepository,
    private reportRepository: IReportRepository,
    private reportIntegration: IReportIntegration,
  ) {}

  async execute(urlSlug: string): Promise<SyncReportType | null> {
    if (!isValidUrlSlug(urlSlug)) {
      throw new ResponseError(ExceptionsConstants.INVALID_URL_SLUG, HttpStatus.BAD_REQUEST);
    }

    const tenant = await this.tenantRepository.findBySlug(urlSlug);

    if (!tenant) {
      throw new ResponseError(ExceptionsConstants.TENANT_NOT_FOUND, HttpStatus.BAD_REQUEST);
    }

    const { externalWorkspaceId: workspaceId, _id } = tenant;

    const [reportsFromPBI, tenantReports] = await Promise.all([
      this.reportIntegration.getPBIReportsByWorkspaceId(workspaceId),
      this.reportRepository.findReportsByTenantSlug(urlSlug),
    ]);

    if (reportsFromPBI?.value.length) {
      const newReports = this.compareReports(reportsFromPBI, tenantReports, _id);

      if (!newReports.length) return { createdReports: 0, reports: [] };

      if (newReports.length) {
        try {
          const data = await this.reportRepository.createMany(newReports);

          return { createdReports: data.length, reports: data };
        } catch (error) {
          if (error instanceof ResponseError) {
            console.error(ExceptionsConstants.INTERNAL_SERVER_ERROR);
          }
        }
      }
    }
  }

  private compareReports(reportsFromPBI, tenantReports, _id) {
    return reportsFromPBI.value
      .map(report => {
        const reportFromDatabase =
          tenantReports.length &&
          tenantReports.find(tenantReport => tenantReport.externalId === report.id);

        if (!reportFromDatabase) {
          return { title: report?.name, externalId: report.id, tenant: _id };
        }
      })
      .filter(Boolean);
  }
}
