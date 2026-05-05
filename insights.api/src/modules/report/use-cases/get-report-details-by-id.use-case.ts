import { HttpStatus, ResponseError } from "@foundation/lib";
import { IReportRepository } from "../interfaces";
import { ExceptionsConstants } from "@/commons/consts/exceptions";
import { IReportFilterRepository } from "@/modules/report-filter/interfaces";
import { ITenantRepository } from "@/modules/tenant/interfaces/tenant.repository.interface";
import { PopulateOptions } from "@/commons/interfaces";

export class GetReportDetailsByIdUseCase {
  private populateReportFilter: PopulateOptions[] = [{ path: "target" }];
  constructor(
    private reportRepository: IReportRepository,
    private reportFilterRepository: IReportFilterRepository,
    private tenantRepository: ITenantRepository,
  ) {}

  async execute(urlSlug: string, reportId: string) {
    const [tenant, report, reportFilters] = await Promise.all([
      this.tenantRepository.findBySlug(urlSlug),
      this.reportRepository.findById(reportId),
      this.reportFilterRepository.listByReportId(reportId, this.populateReportFilter),
    ]);

    if (report.tenant !== tenant._id) {
      throw new ResponseError(ExceptionsConstants.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
    }

    if (!report) {
      throw new ResponseError(ExceptionsConstants.REPORT_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    return { reportFilters, ...report };
  }
}
