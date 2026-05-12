import { HttpStatus, ResponseError } from "@foundation/lib";
import { ExceptionsConstants } from "@/commons/consts/exceptions";
import { TargetFilter } from "../entities";
import { CreateTargetFilterDto } from "../dtos";
import { ITargetFilterRepository } from "../interfaces";
import { IReportRepository } from "@/modules/report/interfaces";

export class CreateTargetFilterUseCase {
  constructor(
    private targetFilterRepository: ITargetFilterRepository,
    private reportRepository: IReportRepository,
  ) {}

  async execute(
    tenantId: string,
    reportId: string,
    body: CreateTargetFilterDto,
  ): Promise<TargetFilter> {
    const { column, table, displayName } = body;

    await this.checkReportExists(tenantId, reportId);
    await this.validateTargetFilterExists(reportId, column, table);

    return this.createTargetFilter(reportId, column, table, displayName);
  }

  private async checkReportExists(tenantId: string, reportId: string) {
    const report = await this.reportRepository.findByIdAndTenantId(reportId, tenantId);

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

  private async createTargetFilter(
    reportId: string,
    column: string,
    table: string,
    displayName?: string,
  ) {
    const targetFilter = await this.targetFilterRepository.create({
      column,
      table,
      displayName,
      report: reportId,
    });

    return targetFilter;
  }
}
