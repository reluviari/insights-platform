import { HealthCheckResponseDTO } from "../dtos";
import { IHealthCheckService } from "../interfaces";
import { HealthCheckUseCase } from "../use-cases/get-health-check.use-case";

export class HealthCheckService implements IHealthCheckService {
  constructor(private healthCheckUseCase: HealthCheckUseCase) {}

  async execute(): Promise<HealthCheckResponseDTO> {
    return this.healthCheckUseCase.execute();
  }
}
