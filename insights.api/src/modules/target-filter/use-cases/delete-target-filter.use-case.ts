import { HttpStatus, ResponseError } from "@foundation/lib";
import { ExceptionsConstants } from "@/commons/consts/exceptions";
import { ITargetFilterRepository } from "../interfaces";
import { IReportRepository } from "@/modules/report/interfaces";

export class DeleteTargetFilterUseCase {
  constructor(
    private targetFilterRepository: ITargetFilterRepository,
    private reportRepository: IReportRepository,
  ) {}

  async execute(reportId: string, targetFilterId: string): Promise<void> {
    await this.checkReportExists(reportId);
    const targetFilter = await this.findTargetFilterById(targetFilterId);

    if (!targetFilter) {
      throw new ResponseError(ExceptionsConstants.TARGET_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    return this.deleteTargetFilterById(targetFilterId);
  }

  private async checkReportExists(reportId: string) {
    const report = await this.reportRepository.findById(reportId);

    if (!report) {
      throw new ResponseError(ExceptionsConstants.REPORT_NOT_FOUND, HttpStatus.BAD_REQUEST);
    }
  }

  private async findTargetFilterById(targetFilterId: string) {
    const targetFilter = await this.targetFilterRepository.findById(targetFilterId);

    if (!targetFilter) {
      throw new ResponseError(ExceptionsConstants.TARGET_NOT_FOUND, HttpStatus.BAD_REQUEST);
    }

    return targetFilter;
  }

  private async deleteTargetFilterById(targetFilterId: string) {
    await this.targetFilterRepository.delete(targetFilterId);
  }
}
