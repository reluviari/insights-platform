import { ConnectMongoDB, Method } from "@foundation/lib";
import { PBIEmbedTokenIntegration } from "@/modules/embed-token/providers/integrations";
import { HealthCheckResponseDTO } from "../dtos";
import { IHealthCheckService } from "../interfaces";
import { HealthCheckRepository } from "../repositories/health-check.repository";
import { HealthCheckUseCase } from "../use-cases/get-health-check.use-case";
import { HealthCheckService } from "../services/health-check.service";
import { reportRepository } from "@/modules/report/repositories/mongo/report/report.repository";

class HealthCheckController {
  constructor(private healthCheckService: IHealthCheckService) {}

  @ConnectMongoDB()
  @Method()
  public async healthCheck() {
    const healthCheck = await this.healthCheckService.execute();

    return HealthCheckResponseDTO.factory(HealthCheckResponseDTO, healthCheck);
  }
}

const repository = new HealthCheckRepository();
const integration = new PBIEmbedTokenIntegration();
const usercase = new HealthCheckUseCase(repository, integration, reportRepository);
const service = new HealthCheckService(usercase);
const controller = new HealthCheckController(service);

export const healthCheck = controller.healthCheck.bind(controller);
