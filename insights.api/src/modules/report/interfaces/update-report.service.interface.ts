import { Report } from "../entities";
import { updateReportRequestType } from "../types";

export interface IUpdateReportService {
  execute(reportId: string, data: updateReportRequestType): Promise<Report>;
}
