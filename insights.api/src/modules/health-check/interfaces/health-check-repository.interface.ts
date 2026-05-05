import { HealthCheckDbResultType } from "../types";

export interface IDatabaseRepository {
  dbPerform(): Promise<HealthCheckDbResultType | boolean>;
}
