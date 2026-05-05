import { BaseDto } from "@/commons/dtos";
import { Expose } from "class-transformer";

export class GetReportPageDto extends BaseDto {
  @Expose()
  name: string;

  @Expose()
  displayName: string;

  @Expose()
  order: number;
}
