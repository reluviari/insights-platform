import { Expose, Type } from "class-transformer";

import { DatabaseDto } from "./database.dto";
import { HealthCheckServiceDto } from "./health-check.service.dto";
import { BaseDto } from "@/commons/dtos";

export class HealthCheckResponseDTO extends BaseDto {
  @Expose()
  @Type(() => HealthCheckServiceDto)
  application: HealthCheckServiceDto;

  @Expose()
  @Type(() => DatabaseDto)
  database: DatabaseDto;

  @Expose()
  @Type(() => HealthCheckServiceDto)
  powerBiEmbed: HealthCheckServiceDto;
}
