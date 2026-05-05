import { Type } from "class-transformer";
import { IsNumber, IsOptional } from "class-validator";

export class CommonPaginateDto {
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  page = 0;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  pageSize = 10;
}
