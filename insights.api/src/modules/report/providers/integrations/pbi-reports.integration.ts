import { getAzureToken } from "@/modules/embed-token/providers/integrations/azure-token.integration";
import { PowerBIReportType } from "../../types";
import { IReportIntegration } from "../../interfaces/report-integration.interface";
import axios from "axios";
import { ExceptionsConstants } from "@/commons/consts/exceptions";
import { HttpStatus, ResponseError } from "@foundation/lib";
import { ReportPage } from "@/modules/embed-token/providers/integrations";

export class PBIReportsIntegration implements IReportIntegration {
  async getPBIReportsByWorkspaceId(workspaceId: string): Promise<PowerBIReportType> {
    const embedPowerbiURL = String(process.env.EMBED_PBI_API_URL);

    const getReportsUrl = `
    ${embedPowerbiURL}/v1.0/myorg/groups/${workspaceId}/reports`;

    try {
      const azureToken = await getAzureToken();

      const { data } = await axios.get(getReportsUrl, {
        headers: {
          Authorization: `Bearer ${azureToken}`,
          "Content-Type": "application/json",
        },
      });

      return data;
    } catch (error) {
      if (error?.response?.status == HttpStatus.UNAUTHORIZED) {
        console.error(ExceptionsConstants.UNAUTHORIZED_GET_REPORTS_FROM_PBI);
      } else {
        console.error(ExceptionsConstants.INTERNAL_SERVER_ERROR);
      }
    }
  }

  async getPBIReportPages(reportId: string): Promise<ReportPage[]> {
    const embedPowerbiURL = String(process.env.EMBED_PBI_API_URL);
    const embedTokenUrl = `
    ${embedPowerbiURL}/v1.0/myorg/reports/${reportId}/pages
    `;

    try {
      const azureToken = await getAzureToken();

      const { data } = await axios.get(embedTokenUrl, {
        headers: {
          Authorization: `Bearer ${azureToken}`,
          "Content-Type": "application/json",
        },
      });

      return data.value;
    } catch (error) {
      throw new ResponseError(
        ExceptionsConstants.FAILED_GET_REPORT_PAGES,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
