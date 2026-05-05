import { IsMongoId, IsNotEmpty, IsOptional } from "class-validator";

export class DepartmentParamsDto {
  @IsNotEmpty()
  @IsMongoId()
  customerId: string;

  @IsOptional()
  @IsMongoId()
  departmentId?: string;
}
