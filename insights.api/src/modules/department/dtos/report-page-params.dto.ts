import { IsMongoId, IsNotEmpty, IsOptional } from "class-validator";

export class ReportPageParamsDto {
  @IsNotEmpty()
  @IsMongoId()
  customerId: string;

  @IsOptional()
  @IsMongoId()
  departmentId: string;

  @IsOptional()
  @IsMongoId()
  reportId?: string;
}
