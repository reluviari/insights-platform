import { CommonPaginateDto } from "@/commons/dtos";
import { IsOptional, IsString } from "class-validator";

export class FilterTargetFilterDto extends CommonPaginateDto {
  @IsOptional()
  @IsString()
  table?: string;

  @IsOptional()
  @IsString()
  column?: string;

  @IsOptional()
  @IsString()
  displayName?: string;
}
