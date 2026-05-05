import { ITokenIntegration } from "@/modules/embed-token/interfaces";
import { IDatabaseRepository } from "../interfaces/health-check-repository.interface";
import { DatabaseHealthCheckResult } from "../types";
import { HealthCheckConstants } from "@/commons/consts/health-check";
import performDatabaseHealthCheck from "../helpers/database.helper";
import performTokenHealthCheck from "../helpers/powerbi-integration.helper";
import { IReportRepository } from "@/modules/report/interfaces";

const UP = "up";
const DOWN = "down";

export class HealthCheckUseCase {
  constructor(
    private databaseRepository: IDatabaseRepository,
    private TokenIntegration: ITokenIntegration,
    private reportRepository: IReportRepository,
  ) {}

  async execute() {
    const databaseResult: DatabaseHealthCheckResult = await performDatabaseHealthCheck(
      this.databaseRepository,
    );

    const { WORKSPACE_ID: workspaceId, REPORT_ID: reportId } = process.env;

    const report = await this.reportRepository.findByExternalId(reportId);
    let tokenIntegration;

    if (report) {
      tokenIntegration = await performTokenHealthCheck(
        this.TokenIntegration,
        workspaceId,
        reportId,
      );
    }

    return {
      application: {
        status: UP,
        description: HealthCheckConstants.APPLICATION,
      },
      database: {
        status: databaseResult?.dbAvailable ? UP : DOWN,
        description: HealthCheckConstants.DATABASE,
        dbSize: databaseResult?.storageSize ?? null,
        dbSpaceUtilization: databaseResult?.dataSize ?? null,
        dbObjects: databaseResult?.objects ?? null,
        dbCollections: databaseResult?.collections ?? null,
      },
      powerBiEmbed: {
        status: typeof tokenIntegration === "string" ? UP : DOWN,
        statusReason: this.getStatusReason(tokenIntegration, report),
        description: HealthCheckConstants.POWER_BI_EMBED,
      },
    };
  }

  private getStatusReason(tokenIntegration, report) {
    if (!report) return "Report health-check test Not Found.";
    if (typeof tokenIntegration !== "string") return "Token Integration is not available.";
    return "Everything is OK.";
  }
}
