import { IsMongoId, IsNotEmpty, IsOptional } from "class-validator";

export class CustomerParamsDto {
  @IsNotEmpty()
  @IsMongoId()
  customerId: string;

  @IsOptional()
  @IsMongoId()
  reportId?: string;
}
