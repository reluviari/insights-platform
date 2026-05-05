import { IsMongoId, IsNotEmpty, IsOptional } from "class-validator";

export class TargetFilterParamsDto {
  @IsNotEmpty()
  @IsMongoId()
  reportId: string;

  @IsOptional()
  @IsMongoId()
  targetFilterId?: string;
}
