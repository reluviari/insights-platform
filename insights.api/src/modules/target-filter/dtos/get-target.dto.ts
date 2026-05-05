import { BaseDto } from "@/commons/dtos";
import { GetReportDto } from "@/modules/report/dtos";
import { Expose, Type } from "class-transformer";

export class GetTargetDto extends BaseDto {
  @Expose()
  @Type(() => GetReportDto)
  report?: GetReportDto | string;

  @Expose()
  table: string;

  @Expose()
  column: string;

  @Expose()
  displayName?: string;
}
