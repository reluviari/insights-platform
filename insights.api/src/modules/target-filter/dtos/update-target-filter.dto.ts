import { IsOptional, IsString } from "class-validator";

export class UpdateTargetFilterDto {
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
