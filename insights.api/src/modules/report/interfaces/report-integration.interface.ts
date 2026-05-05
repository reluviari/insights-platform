import { ReportPage } from "@/modules/embed-token/providers/integrations";
import { PowerBIReportType } from "../types/get-pbi-report.type";

export interface IReportIntegration {
  getPBIReportsByWorkspaceId(workspaceId: string): Promise<PowerBIReportType>;
  getPBIReportPages(reportId: string): Promise<ReportPage[]>;
}
