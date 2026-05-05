import { HttpStatus, ResponseError } from "@foundation/lib";
import { IReportIntegration, IReportRepository } from "../interfaces";
import { ExceptionsConstants } from "@/commons/consts/exceptions";
import { ReportPage } from "@/modules/embed-token/providers/integrations";

export class GetReportPagesUseCase {
  constructor(
    private reportRepository: IReportRepository,
    private reportIntegration: IReportIntegration,
  ) {}

  async execute(reportId: string): Promise<ReportPage[]> {
    const report = await this.reportRepository.findById(reportId);

    if (!report) {
      throw new ResponseError(ExceptionsConstants.REPORT_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    const pages = await this.reportIntegration.getPBIReportPages(report.externalId);

    return pages;
  }
}
