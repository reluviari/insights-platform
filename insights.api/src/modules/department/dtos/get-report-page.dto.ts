import { BaseDto } from "@/commons/dtos";
import { Exclude, Expose } from "class-transformer";

export class GetReportPageDto extends BaseDto {
  @Exclude()
  _id: string;

  @Expose()
  name: string;

  @Expose()
  displayName: string;

  @Expose()
  visible: boolean;
}
