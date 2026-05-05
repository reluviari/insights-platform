import { BaseDto } from "@/commons/dtos";
import { Expose, Type } from "class-transformer";

class ReportDto {
  @Expose()
  title: string;

  @Expose()
  externalId: string;
}

export class SyncReportDto extends BaseDto {
  @Expose()
  createdReports: number;

  @Expose()
  @Type(() => ReportDto)
  reports: ReportDto[];
}
