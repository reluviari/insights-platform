import { BaseDto } from "@/commons/dtos";
import { Expose } from "class-transformer";

export class GetUserDto extends BaseDto {
  @Expose()
  name: string;

  @Expose()
  email: string;

  @Expose()
  avatar: string;

  @Expose()
  phone: string;

  @Expose()
  departments: string[];

  @Expose()
  isActive: boolean;

  @Expose()
  createdAt: Date;
}
