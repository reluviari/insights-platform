import { BaseDto } from "@/commons/dtos";
import { Customer } from "@/modules/customer/entities";
import { ReportFilter } from "@/modules/report-filter/entities";
import { Report } from "@/modules/report/entities";
import { Expose, Type } from "class-transformer";
import { GetReportPageDto } from "./get-report-page.dto";

export class GetDepartmentDetailsDto extends BaseDto {
  @Expose()
  title: string;

  @Expose()
  reports?: string[] | Report[];

  @Expose()
  reportFilters?: string[] | ReportFilter[];

  @Expose()
  @Type(() => GetReportPageDto)
  reportPages?: GetReportPageDto[];

  @Expose()
  customer: string | Customer;

  @Expose()
  isActive: boolean;
}
