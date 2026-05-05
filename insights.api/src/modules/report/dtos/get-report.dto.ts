import { BaseDto } from "@/commons/dtos";
import { Expose } from "class-transformer";

export class GetReportDto extends BaseDto {
  @Expose()
  title: string;

  @Expose()
  icon: string;

  @Expose()
  externalId: string;

  @Expose()
  description: string;

  @Expose()
  createdAt?: Date;
}
