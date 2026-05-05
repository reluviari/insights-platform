import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class UpdateReportRequestDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  icon?: string;

  @IsOptional()
  @IsString()
  description?: string;
}
