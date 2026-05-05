import {
  IsString,
  IsEnum,
  IsNotEmpty,
  ValidateIf,
  IsNumber,
  IsBoolean,
  IsMongoId,
  IsArray,
  IsOptional,
  ValidateNested,
  ArrayMinSize,
} from "class-validator";
import {
  AdvancedFilterConditionOperatorsEnum,
  AdvancedFilterLogicalOperatorsEnum,
  FilterOperatorsEnum,
  FilterType,
  RelativeDateFilterTimeUnitEnum,
} from "../enums";
import { Type } from "class-transformer";

class Condition {
  @IsNotEmpty()
  @IsEnum(AdvancedFilterConditionOperatorsEnum)
  operator: AdvancedFilterConditionOperatorsEnum;

  @IsOptional()
  value?: string | number | boolean | Date;
}

class CreateOrderByFilter {
  @IsNotEmpty()
  @IsEnum(AdvancedFilterConditionOperatorsEnum)
  operator: AdvancedFilterConditionOperatorsEnum;

  @IsOptional()
  @IsString()
  table?: string;

  @IsOptional()
  @IsString()
  column?: string;

  @IsOptional()
  @IsString()
  displayName?: string;

  @IsOptional()
  @IsString()
  $schema?: string;

  @IsOptional()
  @IsString()
  hierarchy?: string;

  @IsOptional()
  @IsString()
  hierarchyLevel?: string;

  @IsOptional()
  @IsString()
  measure?: string;

  @IsOptional()
  @IsBoolean()
  percentOfGrandTotal?: boolean;

  @IsOptional()
  @IsString()
  aggregationFunction?: string;
}

export class CreateReportFilterDto {
  // basic
  @IsNotEmpty()
  @IsString()
  $schema: string;

  @IsOptional()
  @IsArray()
  pages?: string[];

  @IsNotEmpty()
  @IsEnum(FilterType)
  filterType: FilterType;

  @ValidateIf(o => o.filterType !== FilterType.Advanced)
  @IsNotEmpty()
  @IsEnum(FilterOperatorsEnum)
  operator: FilterOperatorsEnum;

  @IsNotEmpty()
  @IsMongoId()
  targetId: string;

  @ValidateIf(o => o.filterType === FilterType.Basic)
  @IsArray()
  @IsNotEmpty()
  values: (string | number | boolean)[];

  @ValidateIf(o => o.filterType === FilterType.Basic)
  @IsOptional()
  @IsBoolean()
  requireSingleSelection?: boolean;

  // advanced
  @ValidateIf(o => o.filterType === FilterType.Advanced)
  @IsNotEmpty()
  @IsEnum(AdvancedFilterLogicalOperatorsEnum)
  logicalOperator: AdvancedFilterLogicalOperatorsEnum;

  @ValidateIf(o => o.filterType === FilterType.Advanced)
  @ValidateNested({ each: true })
  @Type(() => Condition)
  @ArrayMinSize(1)
  conditions: Condition[];

  // topN
  @ValidateIf(o => o.filterType === FilterType.TopN)
  @IsNotEmpty()
  @IsNumber()
  itemCount: number;

  @ValidateIf(o => o.filterType === FilterType.TopN)
  @IsNotEmpty()
  orderBy: CreateOrderByFilter;

  // Relative date
  @ValidateIf(
    o => o.filterType === FilterType.RelativeDate || o.filterType === FilterType.RelativeTime,
  )
  @IsNotEmpty()
  @IsNumber()
  timeUnitsCount: number;

  @ValidateIf(
    o => o.filterType === FilterType.RelativeDate || o.filterType === FilterType.RelativeTime,
  )
  @IsNotEmpty()
  @IsEnum(RelativeDateFilterTimeUnitEnum)
  timeUnitType: RelativeDateFilterTimeUnitEnum;

  // Relative time
  @ValidateIf(o => o.filterType === FilterType.RelativeTime)
  @IsNotEmpty()
  @IsBoolean()
  includeToday: boolean;
}
