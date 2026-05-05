import { IsArray, IsMongoId, IsNotEmpty, IsBoolean, IsOptional, IsString } from "class-validator";

export class CreateCustomerDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  clientId?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsNotEmpty()
  @IsString()
  document: string;

  @IsOptional()
  @IsString()
  logo?: string;

  @IsOptional()
  @IsString()
  industry?: string;

  @IsArray()
  @IsOptional()
  @IsMongoId({ each: true })
  reportIds?: string[];

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
