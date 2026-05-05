import { CreateReportFilterDto } from "../dtos";
import { ReportFilter } from "../entities";

export interface IReportFilterService {
  create(reportId: string, customerId: string, data: CreateReportFilterDto): Promise<ReportFilter>;
  delete(reportFilterId: string): Promise<void>;
}
