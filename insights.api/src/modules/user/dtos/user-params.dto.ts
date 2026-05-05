import { IsMongoId, IsNotEmpty, IsOptional } from "class-validator";

export class UserParamsDto {
  @IsNotEmpty()
  @IsMongoId()
  customerId: string;

  @IsOptional()
  @IsMongoId()
  userId?: string;
}
