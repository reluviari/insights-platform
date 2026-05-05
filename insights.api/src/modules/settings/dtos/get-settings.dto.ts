import { BaseDto } from "@/commons/dtos";
import { GetCustomerDto } from "@/modules/customer/dtos";
import { Customer } from "@/modules/customer/entities";
import { GetUserDetailsDto } from "@/modules/user/dtos";
import { User } from "@/modules/user/entities";
import { Expose, Type } from "class-transformer";

class CustomerSettingsDto {
  @Expose()
  @Type(() => GetCustomerDto)
  customers?: GetCustomerDto[] | Customer[];

  @Expose()
  count?: number;
}

class UserSettingsDto {
  @Expose()
  @Type(() => GetUserDetailsDto)
  users?: GetUserDetailsDto[] | User[];

  @Expose()
  count?: number;
}

class ReportSettingsDto {
  @Expose()
  count?: number;
}

export class GetSettingsDto extends BaseDto {
  @Expose()
  @Type(() => CustomerSettingsDto)
  customer?: CustomerSettingsDto;

  @Expose()
  @Type(() => UserSettingsDto)
  user?: UserSettingsDto;

  @Expose()
  @Type(() => ReportSettingsDto)
  report?: ReportSettingsDto;
}
