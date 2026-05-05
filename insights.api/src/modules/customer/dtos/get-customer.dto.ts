import { BaseDto } from "@/commons/dtos";
import { GetReportDto } from "@/modules/report/dtos";
import { GetUserDetailsDto } from "@/modules/user/dtos";
import { Expose, Type } from "class-transformer";

class UserCustomerDto {
  @Expose()
  @Type(() => GetUserDetailsDto)
  rows?: GetUserDetailsDto[];

  @Expose()
  count?: number;
}

class ReportCustomerDto {
  @Expose()
  @Type(() => GetReportDto)
  rows?: GetReportDto[];

  @Expose()
  count?: number;
}

export class GetCustomerDto extends BaseDto {
  @Expose()
  name: string;

  @Expose()
  logo?: string;

  @Expose()
  phone?: string;

  @Expose()
  document?: string;

  @Expose()
  industry: string;

  @Expose()
  isActive: boolean;

  @Expose()
  @Type(() => UserCustomerDto)
  users?: UserCustomerDto;

  @Expose()
  @Type(() => ReportCustomerDto)
  reports?: ReportCustomerDto;
}
