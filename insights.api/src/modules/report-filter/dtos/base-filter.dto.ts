import { Expose, Type } from "class-transformer";
import {
  AdvancedFilterConditionOperatorsEnum,
  AdvancedFilterLogicalOperatorsEnum,
  FilterOperatorsEnum,
  FilterType,
  RelativeDateFilterTimeUnitEnum,
} from "../enums";
import { BaseDto } from "@/commons/dtos";
import { GetCustomerDto } from "@/modules/customer/dtos";
import { GetReportDto } from "@/modules/report/dtos";
import { GetTargetDto } from "@/modules/target-filter/dtos";
import { OrderByFilterDto } from "./order-by-filter.dto";

export class ConditionDto {
  @Expose()
  operator: AdvancedFilterConditionOperatorsEnum;

  @Expose()
  value?: string | number | boolean | Date;
}

export class FilterDisplaySettingsnDto {
  @Expose()
  isLockedInViewMode?: boolean;

  @Expose()
  isHiddenInViewMode?: boolean;

  @Expose()
  displayName?: string;
}

export class BaseFilterDto extends BaseDto {
  @Expose()
  $schema?: string;

  @Expose()
  pages?: string[];

  @Expose()
  @Type(() => GetReportDto)
  report: GetReportDto | string;

  @Expose()
  @Type(() => GetCustomerDto)
  customer: GetReportDto | string;

  @Expose()
  filterType: FilterType;

  @Expose()
  @Type(() => GetTargetDto)
  target: GetTargetDto;

  @Expose()
  displaySettings?: FilterDisplaySettingsnDto;
}

export class BasicFilterDto extends BaseFilterDto {
  @Expose()
  operator: FilterOperatorsEnum;

  @Expose()
  values: (string | number | boolean)[];

  @Expose()
  requireSingleSelection?: boolean;
}

export class AdvancedFilterDto extends BaseFilterDto {
  @Expose()
  logicalOperator: AdvancedFilterLogicalOperatorsEnum;

  @Expose()
  @Type(() => ConditionDto)
  conditions: ConditionDto[];
}

export class TopNFilterDto extends BaseFilterDto {
  @Expose()
  operator: FilterOperatorsEnum;

  @Expose()
  itemCount: number;

  @Expose()
  @Type(() => OrderByFilterDto)
  orderBy: OrderByFilterDto;
}

export class RelativeDateTimeFilterDto extends BaseFilterDto {
  @Expose()
  operator: FilterOperatorsEnum;

  @Expose()
  timeUnitsCount: number;

  @Expose()
  timeUnitType: RelativeDateFilterTimeUnitEnum;
}

export class RelativeTimeFilterDto extends RelativeDateTimeFilterDto {
  @Expose()
  includeToday: boolean;
}
