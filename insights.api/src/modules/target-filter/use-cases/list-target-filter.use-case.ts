import { ITargetFilterRepository, ListTargetFilter } from "@/modules/target-filter/interfaces";
import { FilterTargetFilterDto } from "../dtos";
import { HttpStatus, ResponseError } from "@foundation/lib";
import { ExceptionsConstants } from "@/commons/consts/exceptions";
import { IReportRepository } from "@/modules/report/interfaces";

export class ListTargetFilterUseCase {
  constructor(
    private targetFilterRepository: ITargetFilterRepository,
    private reportRepository: IReportRepository,
  ) {}

  async execute(
    tenantId: string,
    reportId: string,
    filter: FilterTargetFilterDto,
  ): Promise<ListTargetFilter> {
    const { page, pageSize, ...rest } = filter;

    await this.checkReportExists(tenantId, reportId);

    const [targetFilters, count] = await Promise.all([
      this.targetFilterRepository.listAll({ report: reportId, ...rest }, page, pageSize),
      this.targetFilterRepository.count({ report: reportId, ...rest }),
    ]);

    return {
      targetFilters,
      count,
    };
  }

  private async checkReportExists(tenantId: string, reportId: string) {
    const report = await this.reportRepository.findByIdAndTenantId(reportId, tenantId);

    if (!report) {
      throw new ResponseError(ExceptionsConstants.REPORT_NOT_FOUND, HttpStatus.BAD_REQUEST);
    }
  }
}
