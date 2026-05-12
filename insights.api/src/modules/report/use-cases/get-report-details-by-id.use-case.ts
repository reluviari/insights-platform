import { HttpStatus, ResponseError } from "@foundation/lib";
import { IReportRepository } from "../interfaces";
import { ExceptionsConstants } from "@/commons/consts/exceptions";
import { IReportFilterRepository } from "@/modules/report-filter/interfaces";
import { PopulateOptions } from "@/commons/interfaces";

export class GetReportDetailsByIdUseCase {
  private populateReportFilter: PopulateOptions[] = [{ path: "target" }];
  constructor(
    private reportRepository: IReportRepository,
    private reportFilterRepository: IReportFilterRepository,
  ) {}

  async execute(tenantId: string, reportId: string) {
    const report = await this.reportRepository.findByIdAndTenantId(reportId, tenantId);

    if (!report) {
      throw new ResponseError(ExceptionsConstants.REPORT_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    const reportFilters = await this.reportFilterRepository.listByReportId(
      reportId,
      this.populateReportFilter,
    );

    return { reportFilters, ...report };
  }
}
