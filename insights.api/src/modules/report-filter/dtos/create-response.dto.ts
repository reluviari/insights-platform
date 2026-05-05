import { Expose, Type } from "class-transformer";
import { BaseDto } from "@/commons/dtos";
import {
  AdvancedFilterLogicalOperatorsEnum,
  FilterOperatorsEnum,
  FilterType,
  RelativeDateFilterTimeUnitEnum,
} from "../enums";
import { GetTargetDto } from "@/modules/target-filter/dtos";
import { GetReportDto } from "@/modules/report/dtos";
import { ConditionDto, FilterDisplaySettingsnDto } from "./base-filter.dto";
import { OrderByFilterDto } from "./order-by-filter.dto";

export class ReportFilterResponseDto extends BaseDto {
  @Expose()
  $schema?: string;

  @Expose()
  pages?: string[];

  @Expose()
  report: GetReportDto | string;

  @Expose()
  customer: GetReportDto | string;

  @Expose()
  filterType: FilterType;

  @Expose()
  target: GetTargetDto | string;

  @Expose()
  @Type(() => FilterDisplaySettingsnDto)
  displaySettings?: FilterDisplaySettingsnDto;

  @Expose()
  operator: FilterOperatorsEnum;

  @Expose()
  values: (string | number | boolean)[];

  @Expose()
  requireSingleSelection?: boolean;

  @Expose()
  logicalOperator: AdvancedFilterLogicalOperatorsEnum;

  @Expose()
  conditions: ConditionDto[];

  @Expose()
  itemCount: number;

  @Expose()
  @Type(() => OrderByFilterDto)
  orderBy: OrderByFilterDto;

  @Expose()
  timeUnitsCount: number;

  @Expose()
  timeUnitType: RelativeDateFilterTimeUnitEnum;

  @Expose()
  includeToday: boolean;
}
