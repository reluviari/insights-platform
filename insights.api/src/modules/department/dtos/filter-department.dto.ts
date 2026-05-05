import { CommonPaginateDto } from "@/commons/dtos";
import { Expose } from "class-transformer";

export class FilterDepartmentDto extends CommonPaginateDto {
  @Expose()
  title?: string;

  @Expose()
  isActive?: boolean;
}
