import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateTargetFilterDto {
  @IsNotEmpty()
  @IsString()
  table: string;

  @IsNotEmpty()
  @IsString()
  column: string;

  @IsOptional()
  @IsString()
  displayName?: string;
}
