import { BaseDto } from "@/commons/dtos";
import { Expose } from "class-transformer";

export class HealthCheckServiceDto extends BaseDto {
  @Expose()
  status: string;

  @Expose()
  statusReason?: string;

  @Expose()
  description: string;

  @Expose()
  duration?: string;
}
