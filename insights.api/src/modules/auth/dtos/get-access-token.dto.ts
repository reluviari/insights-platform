import { BaseDto } from "@/commons/dtos";
import { Expose } from "class-transformer";

export class GetAccessTokenDto extends BaseDto {
  @Expose()
  accessToken: string;

  @Expose()
  refreshToken?: string;
}
