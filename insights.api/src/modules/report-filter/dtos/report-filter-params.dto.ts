import { IsMongoId, IsNotEmpty, IsOptional } from "class-validator";

export class ReportFilterParamsDto {
  @IsNotEmpty()
  @IsMongoId()
  customerId: string;

  @IsOptional()
  @IsMongoId()
  reportId?: string;

  @IsOptional()
  @IsMongoId()
  reportFilterId?: string;
}
