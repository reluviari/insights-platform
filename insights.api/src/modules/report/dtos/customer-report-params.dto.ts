import { IsMongoId, IsNotEmpty, IsOptional } from "class-validator";

export class CustomerReportParamsDto {
  @IsNotEmpty()
  @IsMongoId()
  customerId: string;

  @IsOptional()
  @IsMongoId()
  reportId: string;
}
