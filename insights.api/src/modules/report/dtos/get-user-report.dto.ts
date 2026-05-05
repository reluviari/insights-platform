import { BaseDto } from "@/commons/dtos";
import { Expose, Type } from "class-transformer";

import { GetReportDto } from "./get-report.dto";

export class GetUserReportDto extends BaseDto {
  @Expose()
  externalWorkspaceId: string;

  @Expose()
  @Type(() => GetReportDto)
  reports?: GetReportDto[];
}
