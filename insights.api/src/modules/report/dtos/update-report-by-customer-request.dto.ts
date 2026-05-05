import { ReportPageDto } from "@/modules/department/dtos";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class UpdateReportCustomerRequestDto {
  @IsOptional()
  @IsNotEmpty({ each: true })
  filters: ReportFilterDto[];

  @IsOptional()
  @IsNotEmpty()
  reportPages: ReportPageDto[];

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  newDepartmentId: string;
}

export class ReportFilterDto {
  @IsOptional()
  @IsNotEmpty()
  id: string;

  @IsOptional()
  @IsNotEmpty({ each: true })
  values: string[];
}
