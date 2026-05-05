import { CreateReportFilterDto } from "../dtos";
import { ReportFilter } from "../entities";
import { IReportFilterService } from "../interfaces";
import { CreateReportFilterUseCase } from "../use-cases/create-report-filter.use-case";
import { DeleteReportFilterUseCase } from "../use-cases/delete-report-filter.use-case";

export class ReportFilterService implements IReportFilterService {
  constructor(
    private createReportFilterUseCase: CreateReportFilterUseCase,
    private deleteReportFilterUseCase: DeleteReportFilterUseCase,
  ) {}

  async create(
    reportId: string,
    customerId: string,
    data: CreateReportFilterDto,
  ): Promise<ReportFilter> {
    return this.createReportFilterUseCase.execute(reportId, customerId, data);
  }

  async delete(reportFilterId: string): Promise<void> {
    await this.deleteReportFilterUseCase.execute(reportFilterId);
  }
}
