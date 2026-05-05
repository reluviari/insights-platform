import { CommonPaginateDto } from "@/commons/dtos";
import { Type } from "class-transformer";
import { IsOptional, IsString } from "class-validator";

export class FilterUserDto extends CommonPaginateDto {
  @IsOptional()
  @IsString()
  @Type(() => String)
  name?: string;
}
