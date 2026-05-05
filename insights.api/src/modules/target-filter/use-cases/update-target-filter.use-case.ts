import { HttpStatus, ResponseError } from "@foundation/lib";
import { ExceptionsConstants } from "@/commons/consts/exceptions";
import { TargetFilter } from "../entities";
import { UpdateTargetFilterDto } from "../dtos";
import { ITargetFilterRepository } from "../interfaces";
import { IReportRepository } from "@/modules/report/interfaces";

export class UpdateTargetFilterUseCase {
  constructor(
    private targetFilterRepository: ITargetFilterRepository,
    private reportRepository: IReportRepository,
  ) {}

  async execute(
    reportId: string,
    targetFilterId: string,
    body: UpdateTargetFilterDto,
  ): Promise<TargetFilter> {
    await this.checkReportExists(reportId);

    const targetFilter = await this.findTargetFilterById(targetFilterId);

    const { column, table, displayName } = body;

    const validateColumn = column || targetFilter.column;
    const validateTable = table || targetFilter.table;

    await this.validateTargetFilterExists(reportId, validateColumn, validateTable);

    return this.updateTargetFilter(targetFilterId, column, table, displayName);
  }

  private async checkReportExists(reportId: string) {
    const report = await this.reportRepository.findById(reportId);

    if (!report) {
      throw new ResponseError(ExceptionsConstants.REPORT_NOT_FOUND, HttpStatus.BAD_REQUEST);
    }
  }

  private async validateTargetFilterExists(reportId: string, column: string, table: string) {
    const targetFilterExists =
      await this.targetFilterRepository.findByReportIdAndColumnAndTableAndDisplayName(
        reportId,
        column,
        table,
        null,
      );

    if (targetFilterExists) {
      throw new ResponseError(ExceptionsConstants.TARGET_ALREADY_EXIST, HttpStatus.BAD_REQUEST);
    }
  }

  private async findTargetFilterById(targetFilterId: string) {
    const targetFilter = await this.targetFilterRepository.findById(targetFilterId);

    if (!targetFilter) {
      throw new ResponseError(ExceptionsConstants.TARGET_NOT_FOUND, HttpStatus.BAD_REQUEST);
    }

    return targetFilter;
  }

  private async updateTargetFilter(
    targetFilterId: string,
    column?: string,
    table?: string,
    displayName?: string,
  ) {
    const targetFilter = await this.targetFilterRepository.update(targetFilterId, {
      column,
      table,
      displayName,
    });

    return targetFilter;
  }
}
