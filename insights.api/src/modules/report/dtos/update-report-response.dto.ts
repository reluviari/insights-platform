import { BaseDto } from "@/commons/dtos";
import { Expose } from "class-transformer";

export class UpdateReportResponseDto extends BaseDto {
  @Expose()
  title: string;

  @Expose()
  description: string;

  @Expose()
  externalId: string;

  @Expose()
  icon: string;
}
