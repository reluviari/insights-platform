import { IsMongoId, IsNotEmpty, IsOptional } from "class-validator";

export class ReportParamsDto {
  @IsOptional()
  @IsMongoId()
  customerId?: string;

  @IsNotEmpty()
  @IsMongoId()
  reportId: string;

  @IsOptional()
  @IsNotEmpty()
  @IsMongoId()
  departmentId?: string;
}
