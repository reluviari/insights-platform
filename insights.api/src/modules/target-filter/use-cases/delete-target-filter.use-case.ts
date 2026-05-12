import { HttpStatus, ResponseError } from "@foundation/lib";
import { ExceptionsConstants } from "@/commons/consts/exceptions";
import { ITargetFilterRepository } from "../interfaces";
import { IReportRepository } from "@/modules/report/interfaces";

export class DeleteTargetFilterUseCase {
  constructor(
    private targetFilterRepository: ITargetFilterRepository,
    private reportRepository: IReportRepository,
  ) {}

  async execute(tenantId: string, reportId: string, targetFilterId: string): Promise<void> {
    await this.checkReportExists(tenantId, reportId);
    const targetFilter = await this.findTargetFilterById(reportId, targetFilterId);

    if (!targetFilter) {
      throw new ResponseError(ExceptionsConstants.TARGET_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    return this.deleteTargetFilterById(reportId, targetFilterId);
  }

  private async checkReportExists(tenantId: string, reportId: string) {
    const report = await this.reportRepository.findByIdAndTenantId(reportId, tenantId);

    if (!report) {
      throw new ResponseError(ExceptionsConstants.REPORT_NOT_FOUND, HttpStatus.BAD_REQUEST);
    }
  }

  private async findTargetFilterById(reportId: string, targetFilterId: string) {
    const targetFilter = await this.targetFilterRepository.findByIdAndReportId(
      targetFilterId,
      reportId,
    );

    if (!targetFilter) {
      throw new ResponseError(ExceptionsConstants.TARGET_NOT_FOUND, HttpStatus.BAD_REQUEST);
    }

    return targetFilter;
  }

  private async deleteTargetFilterById(reportId: string, targetFilterId: string) {
    await this.targetFilterRepository.deleteByIdAndReportId(targetFilterId, reportId);
  }
}
