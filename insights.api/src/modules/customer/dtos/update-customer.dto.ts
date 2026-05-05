import { Report } from "@/modules/report/entities";
import { Tenant } from "@/modules/tenant/entities/tenant";
import { IsBoolean, IsOptional, IsString } from "class-validator";

export class UpdateCustomerDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  clientId?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  document?: string;

  @IsOptional()
  @IsString()
  logo?: string;

  @IsOptional()
  @IsString()
  industry?: string;

  @IsOptional()
  @IsString()
  reports?: string[] | Report[];

  @IsOptional()
  @IsString()
  tenant?: string | Tenant;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
