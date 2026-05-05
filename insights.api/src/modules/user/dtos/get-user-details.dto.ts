import { BaseDto } from "@/commons/dtos";
import { GetCustomerDto } from "@/modules/customer/dtos";
import { GetDepartmentDto } from "@/modules/department/dtos";
import { Expose, Type } from "class-transformer";

export class GetUserDetailsDto extends BaseDto {
  @Expose()
  name: string;

  @Expose()
  email: string;

  @Expose()
  avatar: string;

  @Expose()
  phone: string;

  createdTokenAt: number;

  @Expose({ name: "lastLogin" })
  convertDate() {
    return new Date(this.createdTokenAt * 1000);
  }

  @Expose()
  @Type(() => GetCustomerDto)
  customer?: GetCustomerDto;

  @Expose()
  @Type(() => GetDepartmentDto)
  departments?: GetDepartmentDto[];

  @Expose()
  isActive: boolean;

  @Expose()
  createdAt: Date;
}
