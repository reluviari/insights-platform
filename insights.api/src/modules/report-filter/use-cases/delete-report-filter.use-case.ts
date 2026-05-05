import { IReportFilterRepository } from "../interfaces";
import { HttpStatus, ResponseError } from "@foundation/lib";
import { ExceptionsConstants } from "@/commons/consts/exceptions";

export class DeleteReportFilterUseCase {
  constructor(private reportFilterRepository: IReportFilterRepository) {}

  async execute(reportFilterId: string): Promise<void> {
    const reportFilter = await this.reportFilterRepository.findById(reportFilterId);

    if (!reportFilter) {
      throw new ResponseError(ExceptionsConstants.REPORT_FILTER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    await this.reportFilterRepository.delete(reportFilterId);
  }
}
