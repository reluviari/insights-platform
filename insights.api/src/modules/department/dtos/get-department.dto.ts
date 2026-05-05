import { BaseDto } from "@/commons/dtos";
import { Expose } from "class-transformer";

export class GetDepartmentDto extends BaseDto {
  @Expose()
  title: string;

  @Expose()
  isActive: string;
}
