import { HealthCheckResponseDTO } from "../dtos";

export interface IHealthCheckService {
  execute(): Promise<HealthCheckResponseDTO>;
}
