import { Expose } from "class-transformer";
import { HealthCheckServiceDto } from "./health-check.service.dto";

export class DatabaseDto extends HealthCheckServiceDto {
  @Expose()
  dbAvailable?: boolean;

  @Expose()
  dbSize?: number;

  @Expose()
  dbSpaceUtilization?: number;

  @Expose()
  dbObjects?: number;

  @Expose()
  dbCollections?: number;

  @Expose()
  error?: string;
}
