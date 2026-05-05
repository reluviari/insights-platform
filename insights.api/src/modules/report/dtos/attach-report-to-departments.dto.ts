import { CreateReportFilterDto } from "@/modules/report-filter/dtos";
import { Type } from "class-transformer";
import {
  IsNotEmpty,
  IsMongoId,
  IsOptional,
  IsArray,
  IsBoolean,
  IsString,
  ValidateNested,
} from "class-validator";

class CreateReportPageDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  displayName: string;

  @IsNotEmpty()
  @IsBoolean()
  visible: boolean;
}

export class AttachReportToDepartmentsDto {
  @IsNotEmpty()
  @IsMongoId()
  departmentId: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateReportPageDto)
  reportPages: CreateReportPageDto[];

  @IsOptional()
  @IsArray()
  reportFilters: CreateReportFilterDto[];
}
